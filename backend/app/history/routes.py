import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Query, status

from app.db.database import get_db_connection
from app.auth.security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/history", tags=["history"])


@router.get("")
async def get_user_history(
    activity_type: Optional[str] = Query(None, description="Filter by activity_type (interaction, outcome, learning, meeting_prep, ai_question)"),
    deal_id: Optional[str] = Query(None, description="Filter by deal_id"),
    limit: int = Query(50, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    """Retrieve chronologically sorted activity and intelligence history for the authenticated user."""
    conn = get_db_connection()
    cursor = conn.cursor()

    company_id = current_user.get("company_id")
    if not company_id:
        return {"status": "success", "user_id": current_user["id"], "count": 0, "activities": []}

    query = "SELECT id, user_id, deal_id, company, activity_type, title, description, created_at FROM activities WHERE company_id = ?"
    params = [company_id]

    if activity_type and activity_type.lower() != "all":
        query += " AND activity_type = ?"
        params.append(activity_type.lower())

    if deal_id and deal_id.lower() != "all":
        query += " AND deal_id = ?"
        params.append(deal_id.lower())

    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    conn.close()

    activities = [
        {
            "id": r["id"],
            "deal_id": r["deal_id"],
            "company": r["company"] or "Deal Activity",
            "activity_type": r["activity_type"],
            "title": r["title"],
            "description": r["description"],
            "created_at": r["created_at"],
        }
        for r in rows
    ]

    return {
        "status": "success",
        "user_id": current_user["id"],
        "count": len(activities),
        "activities": activities,
    }


@router.delete("/{activity_id}")
async def delete_user_activity(activity_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a specific activity item owned by the authenticated user."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM activities WHERE id = ? AND user_id = ?", (activity_id, current_user["id"]))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity item not found or you do not have permission to delete it.",
        )

    cursor.execute("DELETE FROM activities WHERE id = ? AND user_id = ?", (activity_id, current_user["id"]))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Activity item deleted successfully.",
        "id": activity_id,
    }
