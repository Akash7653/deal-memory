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

    # 1. Seed Main Admin Account (akash@admin.com / micky@2710)
    pw_admin = bcrypt.hashpw("micky@2710".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    cursor.execute("DELETE FROM users WHERE id NOT IN ('demo-user-001', 'user_jordan', 'admin_akash_001')")
    cursor.execute(
        """
        INSERT OR REPLACE INTO users (id, company_id, name, email, password_hash, company, role, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        ("admin_akash_001", None, "Akash", "akash@admin.com", pw_admin, "DealMemory HQ", "admin", "active", now_iso),
    )

    # 2. Seed Approved Demo Company: TechNova Solutions
    cursor.execute("SELECT id FROM companies WHERE id = 'comp_technova'")
    existing_comp = cursor.fetchone()
    if not existing_comp:
        cursor.execute(
            """
            INSERT INTO companies (id, name, email, industry, size, contact_person, contact_email, phone, status, created_at, approved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "comp_technova",
                "TechNova Solutions",
                "contact@technova.io",
                "Enterprise AI & Cloud Infrastructure",
                "100-500",
                "Alex Carter",
                "demo@dealmemory.ai",
                "+1 (555) 782-9012",
                "approved",
                "2026-09-20T08:00:00Z",
                "2026-09-20T08:30:00Z",
            ),
        )

    # 3. Seed Demo User under TechNova Solutions
    cursor.execute("SELECT id FROM users WHERE email = 'demo@dealmemory.ai'")
    existing_user = cursor.fetchone()
    demo_id = "demo-user-001"
    pw_hash = bcrypt.hashpw("demopassword123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    if not existing_user:
        cursor.execute(
            """
            INSERT INTO users (id, company_id, name, email, password_hash, company, role, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (demo_id, "comp_technova", "Alex Carter", "demo@dealmemory.ai", pw_hash, "TechNova Solutions", "company_admin", "active", now_iso),
        )
    else:
        cursor.execute(
            "UPDATE users SET company_id = 'comp_technova', company = 'TechNova Solutions', role = 'company_admin', status = 'active' WHERE email = 'demo@dealmemory.ai'"
        )

    # Clean up any orphan deals without company_id
    cursor.execute("DELETE FROM deals WHERE company_id IS NULL OR company_id = ''")

    # 4. Seed Customers under TechNova Solutions
    customers_data = [
        ("cust_globes", "comp_technova", "Globes Industries", "Manufacturing", "Rohan Mehta (CTO)"),
        ("cust_acme", "comp_technova", "ACME Corp", "Retail & Supply Chain", "Sarah (VP Sales), David (CTO), Michael (CFO)"),
        ("cust_globex", "comp_technova", "Globex Corporation", "Financial Services", "Elena Rostova (Head of Procurement)"),
        ("cust_stark", "comp_technova", "Stark Logistics", "Global Freight", "Marcus Vance (VP Operations)"),
    ]
    for cust in customers_data:
        cursor.execute(
            """
            INSERT OR REPLACE INTO customers (id, company_id, name, industry, contact_information, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (cust[0], cust[1], cust[2], cust[3], cust[4], now_iso),
        )

    # 5. Seed Deals under TechNova Solutions (Total Active ARR: $595,000 across 4 deals)
    deals_data = [
        ("globes", "comp_technova", "cust_globes", demo_id, "Globes Industries Digital Transformation", 180000, "Discovery", 80, "2026-09-28T10:00:00Z"),
        ("acme", "comp_technova", "cust_acme", demo_id, "ACME Corp", 120000, "Evaluation", 78, "2026-09-20T09:00:00Z"),
        ("stark", "comp_technova", "cust_stark", demo_id, "Stark Logistics", 210000, "Negotiation", 65, "2026-09-25T15:30:00Z"),
        ("globex", "comp_technova", "cust_globex", demo_id, "Globex Corporation", 85000, "Discovery", 82, "2026-09-22T11:00:00Z"),
    ]
    for d in deals_data:
        cursor.execute(
            """
            INSERT OR REPLACE INTO deals (id, company_id, customer_id, owner_user_id, company_name, deal_value, stage, relationship_health, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            d,
        )

    # 6. Seed Interactions under TechNova
    interactions_data = [
        ("inter_globes_1", "comp_technova", "cust_globes", demo_id, "globes", "Globes Industries", "Rohan Mehta", "CTO", "discovery", "Rohan Mehta requires API-first ERP/CRM integration and raised security and migration concerns.", "2026-09-28", "Schedule technical deep dive on architecture", "2026-09-28T11:00:00Z"),
        ("inter_globes_2", "comp_technova", "cust_globes", demo_id, "globes", "Globes Industries", "Rohan Mehta", "CTO", "technical", "Conducted technical architecture review. Rohan confirmed API-first sync fits ERP roadmap but emphasized security review and operational continuity plan are mandatory next.", "2026-09-28", "Complete enterprise security validation", "2026-09-28T14:30:00Z"),
        ("inter_acme_1", "comp_technova", "cust_acme", demo_id, "acme", "ACME Corp", "Sarah", "VP Sales", "discovery", "Sarah stated core requirement for an API-first platform to unify sales pipeline data across internal systems.", "2026-09-20", "Technical evaluation with David", "2026-09-20T10:00:00Z"),
        ("inter_acme_2", "comp_technova", "cust_acme", demo_id, "acme", "ACME Corp", "David", "CTO", "technical", "David expressed major concerns regarding integration complexity, webhook latency, and enterprise security compliance.", "2026-09-22", "Commercial proposal with Michael", "2026-09-22T14:30:00Z"),
        ("inter_acme_3", "comp_technova", "cust_acme", demo_id, "acme", "ACME Corp", "Michael", "CFO", "pricing", "Michael expressed budget pushback; pricing considered high without explicit ROI proof.", "2026-09-24", "Proposal revision", "2026-09-24T16:00:00Z"),
        ("inter_stark_1", "comp_technova", "cust_stark", demo_id, "stark", "Stark Logistics", "Marcus Vance", "VP Operations", "discovery", "Marcus Vance outlined logistics fleet tracking dispatch requirements and carrier SLA monitoring.", "2026-09-25", "Operations workflow review", "2026-09-25T15:30:00Z"),
        ("inter_globex_1", "comp_technova", "cust_globex", demo_id, "globex", "Globex Corporation", "Elena Rostova", "Head of Procurement", "discovery", "Elena Rostova reviewed procurement vendor compliance and contract schedules.", "2026-09-22", "Vendor security questionnaire", "2026-09-22T11:00:00Z"),
    ]
    for inter in interactions_data:
        cursor.execute(
            """
            INSERT OR REPLACE INTO interactions (id, company_id, customer_id, user_id, deal_id, company, contact_name, contact_role, interaction_type, content, date, outcome, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            inter,
        )

    # 7. Seed Outcomes under TechNova
    outcomes_data = [
        ("out_globes_1", "comp_technova", demo_id, "globes", "Globes Industries", "Technical Architecture Deep Dive", "successful", "Technical deep dive successfully addressed API architecture concerns. Enterprise security validation is now the critical prerequisite before commercial terms.", "2026-09-28", "2026-09-28T15:00:00Z"),
        ("out_acme_1", "comp_technova", demo_id, "acme", "ACME Corp", "15% Upfront Annual Discount", "unsuccessful", "15% upfront discount rejected by CFO Michael. Proposal lacked quantified integration ROI; price concession signaled low product value.", "2026-09-26", "2026-09-26T11:15:00Z"),
    ]
    for out in outcomes_data:
        cursor.execute(
            """
            INSERT OR REPLACE INTO outcomes (id, company_id, user_id, deal_id, company, strategy, result, details, date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            out,
        )

    # 8. Seed Activities under TechNova
    activities = [
        ("act_globes_1", "comp_technova", demo_id, "globes", "Globes Industries", "interaction", "Discovery Call with Rohan Mehta (CTO)", "Rohan Mehta requires API-first ERP/CRM integration and raised security and migration concerns.", "2026-09-28T11:00:00Z"),
        ("act_globes_2", "comp_technova", demo_id, "globes", "Globes Industries", "outcome", "Strategy Outcome: Architecture Deep Dive", "Technical deep dive successfully addressed API architecture concerns; security review pending.", "2026-09-28T15:00:00Z"),
        ("act_globes_3", "comp_technova", demo_id, "globes", "Globes Industries", "learning", "Hindsight Strategic Reflection", "Technical validation can progress the relationship, but security validation remains a prerequisite.", "2026-09-28T17:00:00Z"),
        ("act_1", "comp_technova", demo_id, "acme", "ACME Corp", "interaction", "Discovery Call with Sarah (VP Sales)", "Sarah outlined the core requirement for an API-first platform to unify sales pipeline data.", "2026-09-20T10:00:00Z"),
        ("act_2", "comp_technova", demo_id, "acme", "ACME Corp", "interaction", "Technical Evaluation with David (CTO)", "David raised critical concerns regarding integration complexity and security architecture.", "2026-09-22T14:30:00Z"),
        ("act_3", "comp_technova", demo_id, "acme", "ACME Corp", "interaction", "Commercial Review with Michael (CFO)", "Michael expressed budget pushback; pricing considered high without explicit ROI proof.", "2026-09-24T16:00:00Z"),
        ("act_4", "comp_technova", demo_id, "acme", "ACME Corp", "outcome", "Failed Strategy: 15% Upfront Discount", "Discount strategy rejected by CFO Michael. Proposal lacked quantified integration ROI.", "2026-09-26T11:15:00Z"),
        ("act_5", "comp_technova", demo_id, "acme", "ACME Corp", "learning", "Hindsight Reflection Triggered", "Extracted strategic takeaway: Price resistance is a proxy for unproven integration ROI.", "2026-09-27T09:00:00Z"),
        ("act_6", "comp_technova", demo_id, "acme", "ACME Corp", "meeting_prep", "Generated Executive Meeting Brief", "Recommended pivoting to ROI business case & addressing CTO security architecture.", "2026-09-27T17:30:00Z"),
        ("act_stark_1", "comp_technova", demo_id, "stark", "Stark Logistics", "interaction", "Logistics Architecture Discovery", "Marcus Vance reviewed carrier tracking and dispatch integration requirements.", "2026-09-25T15:30:00Z"),
        ("act_globex_1", "comp_technova", demo_id, "globex", "Globex Corporation", "interaction", "Procurement Compliance Alignment", "Elena Rostova confirmed financial services vendor procurement specifications.", "2026-09-22T11:00:00Z"),
    ]
    for act in activities:
        cursor.execute(
            """
            INSERT OR REPLACE INTO activities (id, company_id, user_id, deal_id, company, activity_type, title, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            act,
        )

    # 9. Seed Learnings for TechNova
    learnings_data = [
        ("learn_globes_1", "comp_technova", "globes", "Technical validation can progress the relationship, but security validation remains a prerequisite. Prioritize security review and provide a detailed migration/continuity plan.", "Successful technical deep dive resolved API concerns while security compliance remains pending.", "2026-09-28T17:00:00Z"),
        ("learn_acme_1", "comp_technova", "acme", "Price resistance is a proxy for unproven integration ROI. Technical buy-in from CTO David is a prerequisite before CFO Michael will release budget.", "15% upfront discount was rejected by CFO Michael after CTO David highlighted unvalidated security specifications.", "2026-09-27T09:05:00Z"),
    ]
    for l in learnings_data:
        cursor.execute(
            """
            INSERT OR REPLACE INTO learnings (id, company_id, deal_id, insight, evidence, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            l,
        )

    # 8. Seed Support Messages between TechNova and Admin
    cursor.execute("SELECT id FROM support_messages WHERE company_id = 'comp_technova'")
    existing_msg = cursor.fetchone()
    if not existing_msg:
        support_seeds = [
            ("msg_1", "comp_technova", demo_id, "company_user", "Alex Carter", "Hi Admin team, we're testing TechNova's workspace integration with Hindsight memory. Is our memory bank isolated?", "2026-09-28T09:00:00Z"),
            ("msg_2", "comp_technova", demo_id, "admin", "Platform Admin", "Hello Alex! Yes, your workspace memory is strictly isolated in namespace dealmemory-comp_technova. Other tenants cannot access your data.", "2026-09-28T09:15:00Z"),
        ]
        for m in support_seeds:
            cursor.execute(
                """
                INSERT INTO support_messages (id, company_id, user_id, sender_role, sender_name, message, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                m,
            )

    # 9. Seed Pending Access Request Company: Apex Dynamics (for Hackathon Approval Demo)
    cursor.execute("SELECT id FROM companies WHERE id = 'comp_apex'")
    existing_apex = cursor.fetchone()
    if not existing_apex:
        cursor.execute(
            """
            INSERT INTO companies (id, name, email, industry, size, contact_person, contact_email, phone, status, created_at, approved_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "comp_apex",
                "Apex Dynamics",
                "contact@apexdynamics.io",
                "Enterprise FinTech",
                "50-200",
                "Jordan Vance",
                "jordan@apexdynamics.io",
                "+1 (555) 234-8901",
                "pending",
                "2026-09-28T14:00:00Z",
                None,
            ),
        )
        pw_jordan = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        cursor.execute(
            """
            INSERT OR IGNORE INTO users (id, company_id, name, email, password_hash, company, role, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            ("user_jordan", "comp_apex", "Jordan Vance", "jordan@apexdynamics.io", pw_jordan, "Apex Dynamics", "company_admin", "pending", "2026-09-28T14:00:00Z"),
        )

    conn.commit()


# Call init on import
init_db()
