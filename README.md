# DealMemory — AI Relationship Intelligence for B2B Sales

> **Memory → Outcome → Learning → Recommendation**  
> An autonomous B2B sales relationship intelligence agent powered by **Hindsight by Vectorize** persistent memory and **Groq** high-speed LLM inference.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Hindsight](https://img.shields.io/badge/Hindsight-0.10.1-0284c7.svg)](https://vectorize.io)
[![Groq](https://img.shields.io/badge/Groq-Llama%20%2F%20Qwen-f55036.svg)](https://groq.com)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## 📌 Problem

Modern B2B enterprise deals involve multiple executive stakeholders (CEOs, CTOs, CFOs, VPs of Sales), evolving technical objections, changing requirements, and commercial negotiations spread over months.

Sales reps waste hours reconstructing relationship context from scattered CRM notes, call recordings, emails, and past proposals. More critically, **traditional CRMs are passive record-keepers**: they record what happened, but they cannot remember whether past strategies worked or failed, leading sales reps to blindly repeat failed tactics (such as repeatedly offering pricing discounts to customers who are actually hesitant about technical integration risk).

---

## 💡 Solution

**DealMemory** transforms passive CRM records into active, cognitive sales relationship intelligence:

1. **Persistent Relationship Memory**: Remembers every customer interaction, objection, stakeholder role, and commitment via **Hindsight by Vectorize**.
2. **Outcome Tracking**: Records the exact sales strategy attempted and whether it succeeded or failed.
3. **Cognitive Reflection**: Uses Hindsight’s native reflection engine to autonomously reason over historical outcomes and synthesize strategic lessons.
4. **Actionable Pre-Meeting Intelligence**: Prepares sales reps for their next meeting with tailored advice, explicit warnings against repeating failed approaches, and zero-hallucination grounded guidance.

---

## 🧠 Why Memory Matters: The Core Differentiator

Traditional AI sales tools use stateless LLMs or basic RAG vector search, retrieving isolated text snippets without understanding temporal cause-and-effect.

DealMemory implements an autonomous learning loop:

```text
INTERACTION (Discovery, Technical, Commercial)
     ↓
HINDSIGHT MEMORY (Retained Facts, Entities, Context)
     ↓
OUTCOME (Strategy Attempted: Success vs. Failure)
     ↓
HINDSIGHT REFLECTION (Autonomous Reasoning over Outcomes)
     ↓
LEARNED INSIGHT ("Price was a proxy for unverified ROI")
     ↓
NEXT-MEETING RECOMMENDATION ("Do not discount again; prove ROI & security")
```

Hindsight is not merely used as a vector lookup database. It provides:
- **`retain()`**: Semantic memory ingestion capturing stakeholders, roles, dates, and metadata.
- **`recall()`**: Deal-scoped context retrieval with built-in LLM prompt serialization (`to_prompt_string()`).
- **`reflect()`**: Deep cognitive reflection analyzing why previous strategies succeeded or failed, enforcing strict structured decision schemas.

---

## 🏗️ Architecture

```text
                     +---------------------------------------+
                     |         React 18 + Tailwind UI        |
                     |  Dashboard • Timeline • Prep • Agent  |
                     +---------------------------------------+
                                         |
                                (REST API / JSON)
                                         v
                     +---------------------------------------+
                     |          FastAPI Backend Core         |
                     |  Validation • Routing • CORS • Config |
                     +---------------------------------------+
                                         |
                     +---------------------------------------+
                     |            DealMemory Agent           |
                     +---------------------------------------+
                                    /         \
                                   /           \
                                  v             v
                     +-------------------+  +-------------------+
                     | Hindsight Memory  |  |     Groq LLM      |
                     |   by Vectorize    |  | High-Speed Engine |
                     | (0.10.1 SDK Core) |  | (qwen3.8 / Llama) |
                     +-------------------+  +-------------------+
                               |                      |
            +------------------+------------------+   |
            |                  |                  |   |
            v                  v                  v   v
        Retain()           Recall()           Reflect()
   (Interactions)       (Deal History)       (Outcomes)
            |                  |                  |
            +------------------+------------------+
                               |
                               v
               Grounding Facts & Learned Insights
                               |
                               v
                     Grounded Sales Intel
                     (Zero Hallucinations)
```

---

## 🛠️ Tech Stack

- **Backend**: Python 3.13, FastAPI, Uvicorn, Pydantic v2, HTTPX, Python-Dotenv
- **Memory Engine**: `hindsight-client` 0.10.1 (Vectorize Cloud / Self-hosted bank)
- **Language Model**: Groq API (`qwen/qwen3.8-27b` / `llama-3.3-70b-versatile`)
- **Frontend**: React 18, Vite 6, Tailwind CSS v3.4, React Router v6, Lucide React
- **DevOps & Tooling**: Git, Virtual Environment, Production-Safe CORS

---

## ✨ Core Features

1. **Executive Dashboard**:
   - High-level pipeline health ($470K pipeline, ACME Corp $120K opportunity).
   - Instant visual comparison: *Traditional CRM (stores notes) vs. DealMemory (remembers & learns)*.
   - Dynamic Hindsight health indicator (`● Hindsight Connected`).
2. **Account Map & Deal Overview (`/deal`)**:
   - Stakeholder breakdown: Sarah (VP Sales / Champion), David (CTO / Blocker), Michael (CFO / Gatekeeper).
   - Objections & active concerns tracking.
   - Live Hindsight memory stream recalled directly from bank `dealmemory-acme`.
3. **Chronological Memory Timeline (`/timeline`)**:
   - Visual 4-stage progression:
     1. **MEMORY**: Discovery & technical evaluation records.
     2. **OUTCOME**: Prominently displays the failed 15% upfront discount.
     3. **REFLECTION**: Hindsight cognitive reasoning extracting the takeaway (*"Price is a proxy for value"*).
     4. **RECOMMENDATION**: Prescribed battle-plan for the next interaction.
4. **AI Meeting Preparation (`/meeting-prep`)**:
   - 4-pillar executive meeting brief: **What Changed**, **What We Learned**, **What to Do**, and **What to Avoid**.
   - Explicit warnings against repeating failed strategies.
5. **Grounded Sales Intelligence Agent (`/agent`)**:
   - Q&A powered by Groq and grounded in Hindsight facts.
   - Compact **Hindsight Memory Used** source panel.
   - Distinct sections: Remembered Facts, Learned Insights, and Recommendations.
   - **Hallucination Resistant**: Inquiries about unrecorded departments (e.g., Legal) explicitly state no record exists rather than hallucinating answers.
6. **Interaction Retention Form (`/add-interaction`)**:
   - Seamlessly retain new meetings, notes, and strategy outcomes to the Hindsight bank.

---

## ⏱️ 60-Second Hackathon Demo Flow

| Time | Action | What Judges See |
|---|---|---|
| **0:00 - 0:15** | Open **Dashboard** (`/`) | Notice `● Hindsight Connected`. Highlight ACME Corp ($120K): *"Our previous strategy failed: 15% discount rejected by CFO. Hindsight learned that the customer is value-skeptical, not price-sensitive."* |
| **0:15 - 0:30** | Open **Timeline** (`/timeline`) | Walk through the chronological chain: Discovery → Technical → Pricing → **Failed Strategy Outcome (15% discount rejected)** → **Hindsight Cognitive Reflection** (Shift to integration ROI). |
| **0:30 - 0:45** | Open **Meeting Prep** (`/meeting-prep`) | Executive brief showing: **What to Do** (Build ROI business case, technical deep-dive with CTO David) vs. **What to Avoid** (*"Do NOT offer further discounting or use price cuts as a crutch."*) |
| **0:45 - 1:00** | Open **AI Agent** (`/agent`) | 1. Click `"1. Meeting Strategy"` → Agent responds with Remembered Facts, Learned Insights, and Recommendations backed by Hindsight. <br>2. Click `"3. Hallucination Test"` → Agent states DealMemory has no record of legal department feedback, proving zero hallucinations. |

---

## 📡 API Endpoints

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "deal-memory",
  "hindsight_configured": true,
  "hindsight_bank": "dealmemory-acme"
}
```

### 2. Retain Interaction
```http
POST /deals/{deal_id}/interactions
Content-Type: application/json

{
  "company": "ACME Corp",
  "contact_name": "Sarah",
  "contact_role": "VP Sales",
  "interaction_type": "discovery",
  "content": "ACME requires an API-first solution to streamline sales pipeline data.",
  "date": "2026-09-20",
  "tags": ["api", "architecture"]
}
```

### 3. Record Strategy Outcome
```http
POST /deals/{deal_id}/outcomes
Content-Type: application/json

{
  "company": "ACME Corp",
  "outcome_type": "strategy_result",
  "strategy": "Used a pricing discount to overcome the pricing objection.",
  "result": "unsuccessful",
  "details": "Offered a 15% annual discount. CFO Michael rejected it stating lack of clear integration ROI.",
  "date": "2026-09-26",
  "tags": ["pricing", "discount"]
}
```

### 4. Hindsight Cognitive Reflection
```http
POST /deals/{deal_id}/learn
```
**Response:**
```json
{
  "status": "success",
  "deal_id": "acme",
  "bank_id": "dealmemory-acme",
  "learned_insights": [
    "Shift focus from discounting to value justification by building a robust business case that quantifies integration ROI.",
    "Prioritize technical architecture by explicitly demonstrating how the solution solves integration complexity.",
    "Treat the deal as an architectural and ROI-validation exercise rather than a pricing negotiation."
  ]
}
```

### 5. Generate Meeting Preparation Brief
```http
GET /deals/{deal_id}/prepare
```
**Response:**
```json
{
  "deal_id": "acme",
  "company": "ACME Corp",
  "relationship_summary": "Deal currently stalled due to value perception and pricing, despite functional alignment.",
  "key_concerns": ["API-first integration", "Security complexity", "Budget constraints"],
  "recommended_focus": [
    "Build ROI business case quantifying operational savings",
    "Schedule technical deep-dive with David to address security"
  ],
  "avoid_repeating": [
    "Do NOT offer further discounting or use price cuts as a crutch",
    "Do NOT repeat the failed pricing strategy that CFO Michael rejected"
  ]
}
```

### 6. Grounded Agent Q&A
```http
POST /deals/{deal_id}/ask
Content-Type: application/json

{
  "question": "How should I approach the next meeting with ACME?"
}
```
**Response:**
```json
{
  "status": "success",
  "deal_id": "acme",
  "answer": "### 1. Remembered Facts\n...\n### 2. Learned Insights\n...\n### 3. Recommendations\n...",
  "memory_context": { "count": 15 },
  "learned_context": { "reflection_summary": "Shift from discount to integration ROI" }
}
```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ (Tested on Node v20+)
- Python 3.11+ (Tested on Python 3.13)
- Hindsight API credentials (Vectorize)
- Groq API Key

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your HINDSIGHT_API_KEY and GROQ_API_KEY

# Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Verify backend at: `http://127.0.0.1:8000/health`

### 2. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# VITE_API_BASE_URL=http://127.0.0.1:8000

# Start Vite dev server
npm run dev
```

Open dashboard at: `http://127.0.0.1:5173/`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BANK_ID=dealmemory-acme
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=qwen/qwen3.8-27b
ENV=development
CORS_ORIGINS=*
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

> **Security Note**: Never commit `.env` files. Both `backend/.env` and `frontend/.env` are strictly excluded in `.gitignore`.

---

## 🚢 Production Deployment

### Backend
Deploy using any ASGI container (Docker, Fly.io, Render, Railway, AWS ECS):
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
Ensure `CORS_ORIGINS` is set to your production frontend domain (e.g., `https://dealmemory.app`).

### Frontend
Build static production bundle:
```bash
npm run build
```
Deploy the generated `dist/` directory to Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront. Set `VITE_API_BASE_URL` to your production backend URL.

---

## 🏆 Hackathon Highlights

- **Native Hindsight SDK Integration**: Direct asynchronous usage of `aretain()`, `arecall()`, and `areflect()` from `hindsight-client 0.10.1`.
- **Closed-Loop Learning**: Demonstrates that memory is not just retrieval—it directly changes the agent’s future strategy after an outcome failure.
- **Production-Grade UX**: Real B2B SaaS feel with high information density, responsive layouts, and zero placeholder fluff.
- **Auditable & Explainable**: Every recommendation cites the exact remembered facts and learned cognitive takeaways that justified the action.
