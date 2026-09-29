import sqlite3
import os
import uuid
from datetime import datetime, timezone
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

    # 1. Companies Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        industry TEXT,
        size TEXT,
        contact_person TEXT,
        contact_email TEXT,
        phone TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT NOT NULL,
        approved_at TEXT
    )
    """)

    # 2. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        company TEXT,
        role TEXT DEFAULT 'company_user',
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id)
    )
    """)

    # 3. Customers Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        name TEXT NOT NULL,
        industry TEXT,
        contact_information TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id)
    )
    """)

    # 4. Deals Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS deals (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        customer_id TEXT,
        owner_user_id TEXT,
        company_name TEXT NOT NULL,
        deal_value INTEGER DEFAULT 0,
        stage TEXT DEFAULT 'Discovery',
        relationship_health INTEGER DEFAULT 75,
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id),
        FOREIGN KEY(customer_id) REFERENCES customers(id),
        FOREIGN KEY(owner_user_id) REFERENCES users(id)
    )
    """)

    # 5. Interactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interactions (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        customer_id TEXT,
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
        FOREIGN KEY(company_id) REFERENCES companies(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # 6. Outcomes Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS outcomes (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        user_id TEXT NOT NULL,
        deal_id TEXT NOT NULL,
        company TEXT NOT NULL,
        strategy TEXT NOT NULL,
        result TEXT NOT NULL,
        details TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # 7. Learnings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS learnings (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        deal_id TEXT NOT NULL,
        insight TEXT NOT NULL,
        evidence TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id)
    )
    """)

    # 8. Support Messages (Admin <-> Company chat, isolated from sales learning)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS support_messages (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id)
    )
    """)

    # 9. Activities Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        user_id TEXT NOT NULL,
        deal_id TEXT,
        company TEXT,
        activity_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # 10. AI Conversations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ai_conversations (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        user_id TEXT NOT NULL,
        deal_id TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(company_id) REFERENCES companies(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Migrate columns if existing tables lacked them
    tables_to_migrate = [
        ("users", "company_id", "TEXT"),
        ("users", "status", "TEXT DEFAULT 'active'"),
        ("deals", "company_id", "TEXT"),
        ("deals", "customer_id", "TEXT"),
        ("interactions", "company_id", "TEXT"),
        ("interactions", "customer_id", "TEXT"),
        ("outcomes", "company_id", "TEXT"),
        ("activities", "company_id", "TEXT"),
        ("ai_conversations", "company_id", "TEXT"),
    ]
    for tbl, col, col_def in tables_to_migrate:
        try:
            cursor.execute(f"ALTER TABLE {tbl} ADD COLUMN {col} {col_def}")
        except Exception:
            pass

    conn.commit()

    # Seed demo account and admin
    seed_demo_account(cursor, conn)

    conn.close()


def seed_demo_account(cursor, conn):
    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. Ensure Main Platform Super Admin Account exists (akash@admin.com / micky@2710)
    pw_admin = bcrypt.hashpw("micky@2710".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    cursor.execute(
        """
        INSERT OR REPLACE INTO users (id, company_id, name, email, password_hash, company, role, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        ("admin_akash_001", None, "Akash", "akash@admin.com", pw_admin, "DealMemory HQ", "admin", "active", now_iso),
    )

    # 2. One-time clean migration: purge all legacy demo companies and demo users, keeping strictly the platform admin
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS platform_migrations (
        migration_name TEXT PRIMARY KEY,
        applied_at TEXT NOT NULL
    )
    """)
    cursor.execute("SELECT migration_name FROM platform_migrations WHERE migration_name = 'purge_legacy_companies_v1'")
    if not cursor.fetchone():
        cursor.execute("DELETE FROM companies")
        cursor.execute("DELETE FROM users WHERE role != 'admin' AND id != 'admin_akash_001'")
        cursor.execute("DELETE FROM customers")
        cursor.execute("DELETE FROM deals")
        cursor.execute("DELETE FROM interactions")
        cursor.execute("DELETE FROM outcomes")
        cursor.execute("DELETE FROM learnings")
        cursor.execute("DELETE FROM support_messages")
        cursor.execute("DELETE FROM ai_conversations")
        cursor.execute("DELETE FROM activities WHERE company != 'DealMemory HQ'")
        cursor.execute("INSERT INTO platform_migrations VALUES ('purge_legacy_companies_v1', ?)", (now_iso,))

    # Also explicitly purge any leftover demo references
    cursor.execute("DELETE FROM companies WHERE id IN ('comp_technova', 'comp_apex', 'comp_akastech')")
    cursor.execute("DELETE FROM users WHERE id IN ('demo-user-001', 'user_jordan', 'user_akastech_001', 'user_akastech_002') OR email IN ('demo@dealmemory.ai', 'jordan@apexdynamics.io', 'akash@akastech.com', 'akash@akashtech.com')")

    conn.commit()


# Call init on import
init_db()
