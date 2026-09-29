import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, status, Query
from pydantic import BaseModel, EmailStr, Field

logger = logging.getLogger(__name__)
from app.db.database import get_db_connection
from app.auth.security import (
    verify_password,
    create_access_token,
    get_current_admin,
    get_current_user,
)

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Administrator email address")
    password: str = Field(..., description="Administrator password")


class AdminSupportMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message to company")


@router.post("/auth/login")
async def admin_login(req: AdminLoginRequest):
    email_clean = req.email.strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND role = 'admin'", (email_clean,))
    admin_user = cursor.fetchone()
    conn.close()

    if not admin_user or not verify_password(req.password, admin_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials.",
        )

    token = create_access_token({
        "sub": admin_user["id"],
        "email": admin_user["email"],
        "name": admin_user["name"],
        "role": "admin",
    })

    return {
        "status": "success",
        "message": "Administrator authenticated successfully.",
        "token": token,
        "user": {
            "id": admin_user["id"],
            "name": admin_user["name"],
            "email": admin_user["email"],
            "role": "admin",
        },
    }


@router.get("/auth/me")
async def admin_get_me(admin_user: dict = Depends(get_current_admin)):
    return {
        "status": "success",
        "user": {
            "id": admin_user["id"],
            "name": admin_user["name"],
            "email": admin_user["email"],
            "role": "admin",
        },
    }


@router.post("/auth/logout")
async def admin_logout(admin_user: dict = Depends(get_current_admin)):
    return {"status": "success", "message": "Admin session signed out."}


@router.get("/stats")
async def get_admin_stats(admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) AS count FROM companies")
    total_companies = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM companies WHERE status = 'pending'")
    pending_requests = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM companies WHERE status = 'approved'")
    active_companies = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM users")
    total_users = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM deals")
    total_deals = cursor.fetchone()["count"]

    cursor.execute("SELECT id, name, industry, status, created_at FROM companies ORDER BY created_at DESC LIMIT 5")
    recent_companies = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT id, name, email, contact_person, industry, created_at, status FROM companies WHERE status = 'pending' ORDER BY created_at DESC")
    pending_company_requests = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT id, company, activity_type, title, description, created_at FROM activities ORDER BY created_at DESC LIMIT 8")
    recent_activities = [dict(r) for r in cursor.fetchall()]

    cursor.execute("""
    SELECT m.company_id, c.name AS company_name, m.message, m.sender_name, m.created_at
    FROM support_messages m
    LEFT JOIN companies c ON m.company_id = c.id
    ORDER BY m.created_at DESC LIMIT 5
    """)
    recent_conversations = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return {
        "status": "success",
        "total_companies": total_companies,
        "pending_requests": pending_requests,
        "active_companies": active_companies,
        "total_users": total_users,
        "total_deals": total_deals,
        "metrics": {
            "total_companies": total_companies,
            "pending_requests": pending_requests,
            "active_companies": active_companies,
            "total_users": total_users,
            "total_deals": total_deals,
        },
        "recent_companies": recent_companies,
        "pending_requests_list": pending_company_requests,
        "recent_activities": recent_activities,
        "recent_conversations": recent_conversations,
        "recent_support": recent_conversations,
    }


@router.get("/companies")
async def get_admin_companies(
    status_filter: Optional[str] = Query(None, description="Filter by status: pending, approved, rejected"),
    admin_user: dict = Depends(get_current_admin),
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT id, name, email, industry, size, contact_person, contact_email, phone, status, created_at, approved_at FROM companies"
    params = []
    if status_filter and status_filter.lower() != "all":
        query += " WHERE status = ?"
        params.append(status_filter.lower())
    query += " ORDER BY created_at DESC"

    cursor.execute(query, tuple(params))
    companies = [dict(r) for r in cursor.fetchall()]

    for c in companies:
        cursor.execute("SELECT COUNT(*) AS count FROM users WHERE company_id = ?", (c["id"],))
        c["user_count"] = cursor.fetchone()["count"]

        cursor.execute("SELECT COUNT(*) AS count, COALESCE(SUM(deal_value), 0) AS total_val FROM deals WHERE company_id = ?", (c["id"],))
        deal_row = cursor.fetchone()
        c["deal_count"] = deal_row["count"]
        c["pipeline_value"] = deal_row["total_val"]

    conn.close()

    return {"status": "success", "count": len(companies), "companies": companies}


@router.get("/companies/{company_id}")
async def get_admin_company_detail(company_id: str, admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM companies WHERE id = ?", (company_id,))
    comp_row = cursor.fetchone()
    if not comp_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Company not found.")

    company = dict(comp_row)

    cursor.execute("SELECT id, name, email, role, status, created_at FROM users WHERE company_id = ?", (company_id,))
    company["users"] = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT id, name, industry, contact_information, created_at FROM customers WHERE company_id = ?", (company_id,))
    company["customers"] = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT id, company_name, deal_value, stage, relationship_health, created_at FROM deals WHERE company_id = ?", (company_id,))
    company["deals"] = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT id, activity_type, title, description, created_at FROM activities WHERE company_id = ? ORDER BY created_at DESC LIMIT 20", (company_id,))
    company["activities"] = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return {
        "status": "success",
        "company": company,
        "users": company["users"],
        "customers": company["customers"],
        "deals": company["deals"],
        "activities": company["activities"],
    }


@router.delete("/companies/{company_id}")
async def delete_admin_company(company_id: str, admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM companies WHERE id = ?", (company_id,))
    comp = cursor.fetchone()
    if not comp:
        conn.close()
        raise HTTPException(status_code=404, detail="Company not found.")

    comp_name = comp["name"]

    # Cascade delete all related records
    cursor.execute("DELETE FROM users WHERE company_id = ?", (company_id,))
    cursor.execute("DELETE FROM customers WHERE company_id = ?", (company_id,))
    cursor.execute("DELETE FROM deals WHERE company_id = ?", (company_id,))
    cursor.execute("DELETE FROM interactions WHERE company_id = ?", (company_id,))
    cursor.execute("DELETE FROM outcomes WHERE company_id = ?", (company_id,))
    cursor.execute("DELETE FROM support_messages WHERE company_id = ?", (company_id,))
    cursor.execute("DELETE FROM activities WHERE company_id = ?", (company_id,))
    cursor.execute("DELETE FROM companies WHERE id = ?", (company_id,))

    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute(
        """
        INSERT INTO activities (id, user_id, company, activity_type, title, description, created_at)
        VALUES (?, ?, 'Platform Admin', 'auth', 'Company Deleted', ?, ?)
        """,
        (
            f"act_{uuid.uuid4().hex[:8]}",
            admin_user["id"],
            f"Company '{comp_name}' ({company_id}) and all associated workspace records were deleted by administrator.",
            now_iso,
        ),
    )

    conn.commit()
    conn.close()

    try:
        from app.services.hindsight import hindsight_service
        bank_id = f"dealmemory-{company_id}"
        await hindsight_service.delete_bank(bank_id=bank_id)
    except Exception as e:
        logger.debug(f"Could not delete Hindsight bank dealmemory-{company_id}: {e}")

    return {
        "status": "success",
        "message": f"Company '{comp_name}' and all associated workspace data have been deleted successfully.",
        "company_id": company_id,
    }


@router.get("/requests")
async def get_admin_access_requests(admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, industry, size, contact_person, contact_email, phone, status, created_at FROM companies ORDER BY created_at DESC")
    requests = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return requests


@router.post("/requests/{company_id}/approve")
async def approve_access_request(company_id: str, admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM companies WHERE id = ?", (company_id,))
    comp = cursor.fetchone()
    if not comp:
        conn.close()
        raise HTTPException(status_code=404, detail="Company not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE companies SET status = 'approved', approved_at = ? WHERE id = ?", (now_iso, company_id))
    cursor.execute("UPDATE users SET status = 'active' WHERE company_id = ?", (company_id,))

    cursor.execute(
        """
        INSERT INTO activities (id, company_id, user_id, deal_id, company, activity_type, title, description, created_at)
        VALUES (?, ?, ?, ?, ?, 'auth', 'Company Access Approved', ?, ?)
        """,
        (
            f"act_{uuid.uuid4().hex[:8]}",
            company_id,
            admin_user["id"],
            None,
            comp["name"],
            f"Company '{comp['name']}' was approved by platform admin. Enterprise workspace is now active.",
            now_iso,
        ),
    )

    conn.commit()
    conn.close()

    return {"status": "success", "message": f"Company '{comp['name']}' has been approved.", "company_id": company_id}


@router.post("/requests/{company_id}/reject")
async def reject_access_request(company_id: str, admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM companies WHERE id = ?", (company_id,))
    comp = cursor.fetchone()
    if not comp:
        conn.close()
        raise HTTPException(status_code=404, detail="Company not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE companies SET status = 'rejected' WHERE id = ?", (company_id,))
    cursor.execute("UPDATE users SET status = 'inactive' WHERE company_id = ?", (company_id,))

    cursor.execute(
        """
        INSERT INTO activities (id, company_id, user_id, deal_id, company, activity_type, title, description, created_at)
        VALUES (?, ?, ?, ?, ?, 'auth', 'Company Access Rejected', ?, ?)
        """,
        (
            f"act_{uuid.uuid4().hex[:8]}",
            company_id,
            admin_user["id"],
            None,
            comp["name"],
            f"Company access request for '{comp['name']}' was rejected.",
            now_iso,
        ),
    )

    conn.commit()
    conn.close()

    return {"status": "success", "message": f"Company '{comp['name']}' has been rejected.", "company_id": company_id}


@router.get("/users")
async def get_admin_users(admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.id, u.company_id, u.name, u.email, u.role, u.status, u.created_at,
           COALESCE(c.name, u.company, 'Workspace') AS company_name,
           c.status AS company_status
    FROM users u
    LEFT JOIN companies c ON u.company_id = c.id
    ORDER BY u.created_at DESC
    """)
    users = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"status": "success", "count": len(users), "users": users}


@router.delete("/users/{user_id}")
async def delete_admin_user(user_id: str, admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, email, company_id FROM users WHERE id = ?", (user_id,))
    user_row = cursor.fetchone()
    if not user_row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found.")

    if user_row["id"] == admin_user["id"]:
        conn.close()
        raise HTTPException(status_code=400, detail="Cannot delete your own active administrator account.")

    user_name = user_row["name"]
    user_email = user_row["email"]
    comp_id = user_row["company_id"]

    cursor.execute("DELETE FROM support_messages WHERE user_id = ?", (user_id,))
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))

    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute(
        """
        INSERT INTO activities (id, company_id, user_id, company, activity_type, title, description, created_at)
        VALUES (?, ?, ?, 'Platform Admin', 'auth', 'User Deleted', ?, ?)
        """,
        (
            f"act_{uuid.uuid4().hex[:8]}",
            comp_id,
            admin_user["id"],
            f"User '{user_name}' ({user_email}) was deleted by platform administrator.",
            now_iso,
        ),
    )

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": f"User '{user_name}' ({user_email}) was deleted successfully.",
        "user_id": user_id,
    }


@router.get("/conversations")
async def get_admin_conversations(admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, industry, size, status, contact_person, contact_email FROM companies WHERE status = 'approved'")
    companies = [dict(r) for r in cursor.fetchall()]

    for c in companies:
        c["company_id"] = c["id"]
        c["company_name"] = c["name"]

        # Fetch registered users for this company
        cursor.execute(
            "SELECT id, name, email, role, status, created_at FROM users WHERE company_id = ? ORDER BY created_at ASC",
            (c["id"],),
        )
        c["users"] = [dict(r) for r in cursor.fetchall()]

        cursor.execute("""
        SELECT id, company_id, user_id, sender_role, sender_name, message, created_at
        FROM support_messages
        WHERE company_id = ?
        ORDER BY created_at ASC
        """, (c["id"],))
        msgs = [dict(r) for r in cursor.fetchall()]
        for m in msgs:
            m["is_admin"] = (m.get("sender_role") == "admin")
            m["sender_type"] = m.get("sender_role")
            m["user_name"] = m.get("sender_name")
        c["messages"] = msgs
        c["last_message"] = msgs[-1] if msgs else None

    conn.close()
    return {"status": "success", "conversations": companies, "count": len(companies)}


@router.post("/conversations/{company_id}")
async def send_admin_support_message(
    company_id: str,
    req: AdminSupportMessageRequest,
    admin_user: dict = Depends(get_current_admin),
):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name FROM companies WHERE id = ?", (company_id,))
    comp = cursor.fetchone()
    if not comp:
        conn.close()
        raise HTTPException(status_code=404, detail="Company not found.")

    msg_id = f"msg_{uuid.uuid4().hex[:10]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    cursor.execute(
        """
        INSERT INTO support_messages (id, company_id, user_id, sender_role, sender_name, message, created_at)
        VALUES (?, ?, ?, 'admin', 'Platform Admin', ?, ?)
        """,
        (msg_id, company_id, admin_user["id"], req.message.strip(), now_iso),
    )
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": {
            "id": msg_id,
            "company_id": company_id,
            "user_id": admin_user["id"],
            "sender_role": "admin",
            "sender_type": "admin",
            "sender_name": "Platform Admin",
            "user_name": "Platform Admin",
            "is_admin": True,
            "message": req.message.strip(),
            "created_at": now_iso,
        },
    }


@router.get("/activity")
async def get_admin_activity(limit: int = Query(50, ge=1, le=100), admin_user: dict = Depends(get_current_admin)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT a.id, a.company_id, a.user_id, a.deal_id, a.company, a.activity_type, a.title, a.description, a.created_at,
           COALESCE(c.name, a.company) AS company_name
    FROM activities a
    LEFT JOIN companies c ON a.company_id = c.id
    ORDER BY a.created_at DESC
    LIMIT ?
    """, (limit,))
    activities = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {"status": "success", "count": len(activities), "activities": activities}
