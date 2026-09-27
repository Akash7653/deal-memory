from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.memory.hindsight import hindsight_service
from app.deals.routes import router as deals_router

app = FastAPI(
    title="DealMemory API",
    description="AI Relationship Intelligence for B2B Sales",
    version="1.0.0",
)

app.include_router(deals_router)

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


@app.get("/")
async def root():
    return {
        "message": "DealMemory API is running",
        "status": "healthy",
    }


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