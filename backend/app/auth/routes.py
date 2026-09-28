import uuid
from datetime import datetime
from typing import Optional
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


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, description="User's full name")
    email: EmailStr = Field(..., description="User's valid email address")
    password: str = Field(..., min_length=6, description="Password (at least 6 characters)")
    confirm_password: str = Field(..., description="Password confirmation")
    company: Optional[str] = Field(default="", description="Optional company or organization name")


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="Password")


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    company: str
    role: str
    created_at: str


class AuthResponse(BaseModel):
    status: str = "success"
    message: str
    token: str
    user: UserResponse


@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest):
    name_clean = req.full_name.strip()
    email_clean = req.email.strip().lower()
    company_clean = (req.company or "").strip()

    if req.password != req.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match. Please ensure both fields are identical.",
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in.",
        )

    user_id = f"user_{uuid.uuid4().hex[:12]}"
    pw_hash = hash_password(req.password)
    now = datetime.utcnow().isoformat()

    cursor.execute(
        """
        INSERT INTO users (id, name, email, password_hash, company, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (user_id, name_clean, email_clean, pw_hash, company_clean, "Enterprise AE", now),
    )

    # Log initial user registration activity
    cursor.execute(
        """
        INSERT INTO activities (id, user_id, deal_id, company, activity_type, title, description, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            f"act_{uuid.uuid4().hex[:8]}",
            user_id,
            None,
            company_clean or "Personal Workspace",
            "auth",
            "Created DealMemory Account",
            f"Welcome to DealMemory, {name_clean}! Workspace initialized with personal Hindsight isolation.",
            now,
        ),
    )

    conn.commit()
    conn.close()

    token = create_access_token({"sub": user_id, "email": email_clean, "name": name_clean})

    return {
        "status": "success",
        "message": "Account created successfully.",
        "token": token,
        "user": {
            "id": user_id,
            "name": name_clean,
            "email": email_clean,
            "company": company_clean,
            "role": "Enterprise AE",
            "created_at": now,
        },
    }


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    email_clean = req.email.strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, name, email, password_hash, company, role, created_at FROM users WHERE email = ?",
        (email_clean,),
    )
    user = cursor.fetchone()
    conn.close()

    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
        )

    token = create_access_token({"sub": user["id"], "email": user["email"], "name": user["name"]})

    return {
        "status": "success",
        "message": "Signed in successfully.",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "company": user["company"] or "",
            "role": user["role"] or "Enterprise AE",
            "created_at": user["created_at"],
        },
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "status": "success",
        "user": current_user,
    }


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Invalidate or record session logout for authenticated user."""
    return {
        "status": "success",
        "message": "Signed out successfully.",
    }


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, description="Updated name")
    company: Optional[str] = Field(None, description="Updated company")
    role: Optional[str] = Field(None, description="Updated sales role")


@router.patch("/profile")
async def update_profile(req: ProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    updates = []
    params = []

    if req.name is not None and req.name.strip():
        updates.append("name = ?")
        params.append(req.name.strip())

    if req.company is not None:
        updates.append("company = ?")
        params.append(req.company.strip())

    if req.role is not None and req.role.strip():
        updates.append("role = ?")
        params.append(req.role.strip())

    if updates:
        params.append(user_id)
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
        cursor.execute(query, tuple(params))
        conn.commit()

    cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE id = ?", (user_id,))
    updated_user = cursor.fetchone()
    conn.close()

    return {
        "status": "success",
        "message": "Profile updated successfully.",
        "user": {
            "id": updated_user["id"],
            "name": updated_user["name"],
            "email": updated_user["email"],
            "company": updated_user["company"] or "",
            "role": updated_user["role"] or "Enterprise AE",
            "created_at": updated_user["created_at"],
        },
    }
