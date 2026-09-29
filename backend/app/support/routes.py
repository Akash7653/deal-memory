import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from app.db.database import get_db_connection
from app.auth.security import get_current_user

router = APIRouter(prefix="/support", tags=["support"])


class SupportMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, description="Support message content")


@router.get("/messages")
async def get_company_support_messages(current_user: dict = Depends(get_current_user)):
    """Retrieve support conversation between company and DealMemory admin."""
    company_id = current_user.get("company_id")
    if not company_id:
        return {"status": "success", "messages": []}

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, company_id, user_id, sender_role, sender_name, message, created_at
        FROM support_messages
        WHERE company_id = ?
        ORDER BY created_at ASC
        """,
        (company_id,),
    )
    rows = cursor.fetchall()
    conn.close()

    msgs = [dict(r) for r in rows]
    for m in msgs:
        is_adm = (m.get("sender_role") == "admin") or (m.get("sender_name") == "Platform Admin")
        m["is_admin"] = is_adm
        m["sender_type"] = "admin" if is_adm else "company_user"
        m["user_name"] = m.get("sender_name")

    return {
        "status": "success",
        "company_id": company_id,
        "company_name": current_user.get("company_name"),
        "messages": msgs,
    }


@router.post("/messages")
async def send_company_support_message(
    req: SupportMessageCreate,
    current_user: dict = Depends(get_current_user),
):
    """Company user sends message to platform admin."""
    company_id = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="User must belong to a company to message support.")

    msg_id = f"msg_{uuid.uuid4().hex[:10]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO support_messages (id, company_id, user_id, sender_role, sender_name, message, created_at)
        VALUES (?, ?, ?, 'company_user', ?, ?, ?)
        """,
        (msg_id, company_id, current_user["id"], current_user["name"], req.message.strip(), now_iso),
    )
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": {
            "id": msg_id,
            "company_id": company_id,
            "sender_role": "company_user",
            "sender_name": current_user["name"],
            "message": req.message.strip(),
            "created_at": now_iso,
        },
    }


@router.post("/end")
async def end_company_support_session(current_user: dict = Depends(get_current_user)):
    """End the current support session with a system closure marker."""
    company_id = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="User must belong to a company to manage support.")

    msg_id = f"msg_{uuid.uuid4().hex[:10]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    close_text = f"Support session ended by {current_user.get('name', 'User')}. Send a new message at any time to reopen the channel."

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO support_messages (id, company_id, user_id, sender_role, sender_name, message, created_at)
        VALUES (?, ?, ?, 'system', 'DealMemory Support System', ?, ?)
        """,
        (msg_id, company_id, current_user["id"], close_text, now_iso),
    )
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Support session ended successfully.",
        "notice": close_text,
    }


@router.delete("/messages")
async def clear_company_support_messages(current_user: dict = Depends(get_current_user)):
    """Clear/archive support messages for this company workspace."""
    company_id = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="User must belong to a company.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM support_messages WHERE company_id = ?", (company_id,))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Support conversation history cleared successfully.",
    }
