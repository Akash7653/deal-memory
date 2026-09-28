from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import init_db
from app.memory.hindsight import hindsight_service
from app.auth.routes import router as auth_router
from app.deals.routes import router as deals_router
from app.history.routes import router as history_router
from app.admin.routes import router as admin_router
from app.support.routes import router as support_router

app = FastAPI(
    title="DealMemory API",
    description="AI Relationship Intelligence for B2B Sales",
    version="1.0.0",
)

# Initialize database schema
init_db()

app.include_router(auth_router)
app.include_router(deals_router)
app.include_router(history_router)
app.include_router(admin_router)
app.include_router(support_router)

# Production-safe CORS configuration
cors_origins_raw = getattr(settings, "CORS_ORIGINS", "*")
origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()] or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
ASSETS_DIR = DIST_DIR / "assets"
if ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")


@app.get("/")
async def root():
    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {
        "message": "DealMemory API is running",
        "status": "healthy",
    }


@app.get("/api/health")
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "deal-memory",
        "hindsight_configured": bool(settings.HINDSIGHT_API_KEY),
        "hindsight_bank": settings.HINDSIGHT_BANK_ID,
    }


@app.get("/memory/test")
async def test_memory():
    """Verify end-to-end Hindsight connectivity: Retain -> Recall."""
    if not settings.HINDSIGHT_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="HINDSIGHT_API_KEY is not configured in backend/.env. Please add your Hindsight API key.",
        )

    bank_id = settings.HINDSIGHT_BANK_ID or "dealmemory"

    sample_content = (
        "ACME Corp Discovery Call: Sarah (VP Sales) stated ACME wants an API-first solution "
        "to streamline sales pipeline data across systems."
    )

    try:
        # 1. Retain test memory
        retain_res = await hindsight_service.retain(
            bank_id=bank_id,
            content=sample_content,
            context="ACME Discovery Phase",
            tags=["deal:acme", "discovery", "requirement"],
            metadata={"deal": "ACME Corp", "phase": "discovery"},
        )

        # 2. Recall test memory
        recall_res = await hindsight_service.recall(
            bank_id=bank_id,
            query="What kind of solution is ACME Corp looking for?",
            tags=["deal:acme"],
            max_tokens=2048,
        )

        recalled_items = [
            {
                "id": r.id,
                "text": r.text,
                "type": getattr(r, "type", None),
                "context": getattr(r, "context", None),
                "tags": getattr(r, "tags", []),
            }
            for r in (recall_res.results or [])
        ]

        return {
            "status": "success",
            "message": "Hindsight Retain and Recall verified successfully!",
            "bank_id": bank_id,
            "retained": {
                "success": retain_res.success,
                "items_count": retain_res.items_count,
            },
            "recall_count": len(recalled_items),
            "recalled_memories": recalled_items,
            "llm_prompt_preview": recall_res.to_prompt_string()[:500] if hasattr(recall_res, "to_prompt_string") else "",
        }
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Hindsight communication error: {str(e)}",
        )


@app.get("/{full_path:path}")
async def serve_spa_route(full_path: str):
    """
    Catch-all SPA fallback:
    If a static asset or file exists in dist, serve it directly.
    Otherwise serve index.html to allow client-side React Router to resolve routes
    like /dashboard, /deal, /timeline, /meeting-prep, etc. without 404 Not Found.
    """
    if full_path.startswith("api/") or full_path.startswith("auth/") or full_path.startswith("deals/") or full_path.startswith("history/"):
        raise HTTPException(status_code=404, detail="API endpoint not found")

    target_file = DIST_DIR / full_path
    if target_file.is_file():
        return FileResponse(target_file)

    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)

    raise HTTPException(status_code=404, detail="DealMemory web assets not found. Run npm run build in frontend.")