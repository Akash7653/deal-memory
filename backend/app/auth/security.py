import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import settings
from app.db.database import get_db_connection

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception as e:
        logger.error(f"Error checking password hash: {e}")
        return False


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRES_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError as e:
        logger.warning(f"JWT decode error: {e}")
        return None


async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Dict[str, Any]:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication session. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = str(payload["sub"])
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()

    # Resilient fallback: If user was purged by ephemeral DB restart or ID mismatch, check by email
    if not row and payload.get("email"):
        email_clean = payload["email"].strip().lower()
        cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE email = ?", (email_clean,))
        row = cursor.fetchone()

    # Demo user fallback
    if not row and ("demo" in user_id.lower() or payload.get("email") == "demo@dealmemory.ai"):
        cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE id = 'demo-user-001'")
        row = cursor.fetchone()

    # Cryptographically valid token auto-provisioning (handles Render / container restarts seamlessly)
    if not row:
        email_val = payload.get("email", f"{user_id}@dealmemory.ai")
        name_val = payload.get("name") or email_val.split("@")[0].replace(".", " ").capitalize()
        now_str = datetime.utcnow().isoformat() + "Z"
        try:
            cursor.execute(
                """
                INSERT OR IGNORE INTO users (id, name, email, password_hash, company, role, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (user_id, name_val, email_val, "", "DealMemory Workspace", "Enterprise AE", now_str),
            )
            conn.commit()
            cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
        except Exception as e:
            logger.error(f"Error auto-restoring user session: {e}")

    conn.close()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "company": row["company"] or "",
        "role": row["role"] or "Enterprise AE",
        "created_at": row["created_at"],
    }


async def get_optional_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Optional[Dict[str, Any]]:
    if not credentials or not credentials.credentials:
        return None
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    user_id = str(payload["sub"])
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()

    if not row and payload.get("email"):
        cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE email = ?", (payload["email"].strip().lower(),))
        row = cursor.fetchone()

    if not row and ("demo" in user_id.lower() or payload.get("email") == "demo@dealmemory.ai"):
        cursor.execute("SELECT id, name, email, company, role, created_at FROM users WHERE id = 'demo-user-001'")
        row = cursor.fetchone()

    conn.close()
    if not row:
        return None
    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "company": row["company"] or "",
        "role": row["role"] or "Enterprise AE",
        "created_at": row["created_at"],
    }
