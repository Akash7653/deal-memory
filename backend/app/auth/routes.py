import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field

from app.db.database import get_db_connection
from app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


class CompanyRegisterRequest(BaseModel):
    company_name: str = Field(..., min_length=2, description="Company or Organization Name")
    company_email: Optional[str] = Field(default="", description="General Company Email")
    industry: Optional[str] = Field(default="B2B Software", description="Industry domain")
    company_size: Optional[str] = Field(default="10-50", description="Company Size")
    contact_person: str = Field(..., min_length=2, description="Contact Person Full Name")
    contact_email: EmailStr = Field(..., description="Contact / Login Email Address")
    phone: Optional[str] = Field(default="", description="Contact Phone Number")
    password: str = Field(..., min_length=6, description="Password (at least 6 characters)")
    confirm_password: str = Field(..., description="Password confirmation")
    full_name: Optional[str] = Field(default="", description="Alias for contact_person")
    email: Optional[EmailStr] = Field(default=None, description="Alias for contact_email")
    company: Optional[str] = Field(default="", description="Alias for company_name")


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="Password")


@router.post("/register")
async def register(req: CompanyRegisterRequest):
    comp_name = (req.company_name or req.company or "").strip()
    contact_name = (req.contact_person or req.full_name or "").strip()
    contact_email = str(req.contact_email or req.email).strip().lower()

    if not comp_name:
        raise HTTPException(status_code=400, detail="Company Name is required.")
    if not contact_name:
        raise HTTPException(status_code=400, detail="Contact Person name is required.")
    if req.password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match. Please ensure both fields are identical.",
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if contact email already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (contact_email,))
    existing_user = cursor.fetchone()
    if existing_user:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please sign in instead.",
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    company_id = f"comp_{uuid.uuid4().hex[:10]}"
    user_id = f"user_{uuid.uuid4().hex[:10]}"
    pw_hash = hash_password(req.password)

    # Create Company with status = 'pending'
    cursor.execute(
        """
        INSERT INTO companies (id, name, email, industry, size, contact_person, contact_email, phone, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
        """,
        (
            company_id,
            comp_name,
            req.company_email or contact_email,
            req.industry or "Enterprise B2B",
            req.company_size or "10-50",
            contact_name,
            contact_email,
            req.phone or "",
            now_iso,
        ),
    )

    # Create User associated with company
    cursor.execute(
        """
        INSERT INTO users (id, company_id, name, email, password_hash, company, role, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'company_admin', 'pending', ?)
        """,
        (user_id, company_id, contact_name, contact_email, pw_hash, comp_name, now_iso),
    )

    # Log initial platform activity
    cursor.execute(
        """
        INSERT INTO activities (id, company_id, user_id, deal_id, company, activity_type, title, description, created_at)
        VALUES (?, ?, ?, ?, ?, 'auth', 'Company Access Request Submitted', ?, ?)
        """,
        (
            f"act_{uuid.uuid4().hex[:8]}",
            company_id,
            user_id,
            None,
            comp_name,
            f"Access request submitted for company '{comp_name}' by {contact_name} ({contact_email}). Status: pending approval.",
            now_iso,
        ),
    )

    conn.commit()
    conn.close()

    token = create_access_token({
        "sub": user_id,
        "email": contact_email,
        "name": contact_name,
        "role": "company_admin",
        "company_id": company_id,
        "status": "pending",
    })

    return {
        "status": "pending",
        "message": "Your company access request has been submitted. An administrator will review your application shortly.",
        "token": token,
        "company": {
            "id": company_id,
            "name": comp_name,
            "status": "pending",
            "contact_email": contact_email,
        },
        "user": {
            "id": user_id,
            "name": contact_name,
            "email": contact_email,
            "role": "company_admin",
            "status": "pending",
        },
    }


@router.post("/login")
async def login(req: LoginRequest):
    email_clean = req.email.strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, company_id, name, email, password_hash, company, role, status, created_at FROM users WHERE email = ?", (email_clean,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email address. Please register or verify credentials.",
        )

    if not verify_password(req.password, user["password_hash"]):
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please try again or use the demo credentials.",
        )

    # Resolve company information
    company_id = user["company_id"]
    company_name = user["company"] or "Workspace"
    company_status = "approved"

    if company_id:
        cursor.execute("SELECT id, name, status FROM companies WHERE id = ?", (company_id,))
        comp_row = cursor.fetchone()
        if comp_row:
            company_name = comp_row["name"]
            company_status = comp_row["status"]

    conn.close()

    # If company status is pending and not platform admin
    if user["role"] != "admin" and company_status == "pending":
        token = create_access_token({
            "sub": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "company_id": company_id,
            "status": "pending",
        })
        return {
            "status": "pending",
            "message": "Your company access request is currently pending administrator approval.",
            "token": token,
            "company": {
                "id": company_id,
                "name": company_name,
                "status": "pending",
            },
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "status": "pending",
            },
        }

    if user["role"] != "admin" and company_status == "rejected":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your company access request has been rejected. Please contact support@dealmemory.ai.",
        )

    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "company_id": company_id,
    })

    return {
        "status": "success",
        "message": "Signed in successfully.",
        "token": token,
        "user": {
            "id": user["id"],
            "company_id": company_id,
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "status": user["status"] or "active",
        },
        "company": {
            "id": company_id,
            "name": company_name,
            "status": company_status,
        },
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "status": "success",
        "user": {
            "id": current_user["id"],
            "company_id": current_user["company_id"],
            "name": current_user["name"],
            "email": current_user["email"],
            "role": current_user["role"],
            "status": current_user["status"],
        },
        "company": {
            "id": current_user["company_id"],
            "name": current_user["company_name"],
            "status": current_user["company_status"],
        },
    }


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {
        "status": "success",
        "message": "Signed out successfully.",
    }
