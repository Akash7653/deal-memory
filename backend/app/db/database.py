import sqlite3
import os
import uuid
from datetime import datetime
from pathlib import Path
import bcrypt

DB_PATH = Path(__file__).resolve().parent.parent.parent / "dealmemory.db"


def get_db_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        company TEXT,
        role TEXT DEFAULT 'Enterprise AE',
        created_at TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        owner_user_id TEXT NOT NULL,
        company_name TEXT NOT NULL,
        deal_value INTEGER DEFAULT 0,
        stage TEXT DEFAULT 'Discovery',
        relationship_health INTEGER DEFAULT 75,
        created_at TEXT NOT NULL,
        FOREIGN KEY(owner_user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        deal_id TEXT NOT NULL,
        company TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        contact_role TEXT NOT NULL,
        interaction_type TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        outcome TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS outcomes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        deal_id TEXT NOT NULL,
        company TEXT NOT NULL,
        strategy TEXT NOT NULL,
        result TEXT NOT NULL,
        details TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        deal_id TEXT,
        company TEXT,
        activity_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_conversations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        deal_id TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    conn.commit()

    # Seed demo user if not present
    seed_demo_account(cursor, conn)

    conn.close()


def seed_demo_account(cursor, conn):
    cursor.execute("SELECT id FROM users WHERE email = ?", ("demo@dealmemory.ai",))
    existing = cursor.fetchone()
    if not existing:
        demo_id = "demo-user-001"
        pw_hash = bcrypt.hashpw("demopassword123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        now = datetime.utcnow().isoformat()

        cursor.execute(
            """
            INSERT INTO users (id, name, email, password_hash, company, role, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (demo_id, "Alex Carter", "demo@dealmemory.ai", pw_hash, "DealMemory Demo", "Enterprise AE", now),
        )

        # Seed ACME deal for demo user
        cursor.execute(
            """
            INSERT INTO deals (id, owner_user_id, company_name, deal_value, stage, relationship_health, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            ("acme", demo_id, "ACME Corp", 120000, "Evaluation", 78, now),
        )

        # Seed ACME sample activities
        activities = [
            ("act_1", demo_id, "acme", "ACME Corp", "interaction", "Discovery Call with Sarah (VP Sales)", "Sarah outlined the core requirement for an API-first platform to unify sales pipeline data.", "2026-09-20T10:00:00"),
            ("act_2", demo_id, "acme", "ACME Corp", "interaction", "Technical Evaluation with David (CTO)", "David raised critical concerns regarding integration complexity and security architecture.", "2026-09-22T14:30:00"),
            ("act_3", demo_id, "acme", "ACME Corp", "interaction", "Commercial Review with Michael (CFO)", "Michael expressed budget pushback; pricing considered high without explicit ROI proof.", "2026-09-24T16:00:00"),
            ("act_4", demo_id, "acme", "ACME Corp", "outcome", "Failed Strategy: 15% Upfront Discount", "Discount strategy rejected by CFO Michael. Proposal lacked quantified integration ROI.", "2026-09-26T11:15:00"),
            ("act_5", demo_id, "acme", "ACME Corp", "learning", "Hindsight Reflection Triggered", "Extracted strategic takeaway: Price resistance is a proxy for unproven integration ROI.", "2026-09-27T09:00:00"),
            ("act_6", demo_id, "acme", "ACME Corp", "meeting_prep", "Generated Executive Meeting Brief", "Recommended pivoting to ROI business case & addressing CTO security architecture.", "2026-09-27T17:30:00"),
        ]

        for act in activities:
            cursor.execute(
                """
                INSERT INTO activities (id, user_id, deal_id, company, activity_type, title, description, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                act,
            )

        conn.commit()


# Call init on import
init_db()
