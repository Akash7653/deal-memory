import logging
import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, Depends, status
from pydantic import BaseModel, Field

from app.config import settings
from app.memory.hindsight import hindsight_service
from app.agent.agent import deal_memory_agent
from app.db.database import get_db_connection
from app.auth.security import get_current_user, get_optional_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/deals", tags=["deals"])


def get_tenant_bank_id(deal_id_clean: str, user: Optional[dict] = None) -> str:
    """Determine the isolated Hindsight bank ID based on tenant/user ID and deal ID."""
    if not user or user.get("id") == "demo-user-001" or (deal_id_clean == "acme" and not user):
        # Demo account or unauthenticated fallback for ACME demo
        return settings.HINDSIGHT_BANK_ID or "dealmemory-acme"
    
    # Isolated user bank ID
    user_prefix = user["id"].replace("user_", "")[:8]
    return f"dealmemory-{user_prefix}-{deal_id_clean}"


def log_activity(user_id: str, deal_id: Optional[str], company: Optional[str], activity_type: str, title: str, description: str):
    """Helper to log an activity in the database for the user."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO activities (id, user_id, deal_id, company, activity_type, title, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                f"act_{uuid.uuid4().hex[:8]}",
                user_id,
                deal_id,
                company or "ACME Corp",
                activity_type,
                title,
                description,
                datetime.utcnow().isoformat(),
            ),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"Failed to log activity: {e}")


class DealCreate(BaseModel):
    company_name: str = Field(..., description="Company name (e.g. Stripe, Snowflake)")
    deal_value: int = Field(default=50000, description="Annual deal value in USD")
    stage: str = Field(default="Discovery", description="Pipeline stage (Discovery, Evaluation, Proposal, Negotiation)")
    relationship_health: int = Field(default=75, ge=0, le=100, description="Health score percentage")


class InteractionCreate(BaseModel):
    company: str = Field(..., description="Company or customer name (e.g. ACME Corp)")
    contact_name: str = Field(..., description="Key contact person (e.g. Sarah)")
    contact_role: str = Field(..., description="Role of the contact (e.g. VP Sales)")
    interaction_type: str = Field(
        ...,
        description="Type of interaction: discovery, pricing, technical, competitor, proposal, outcome",
    )
    content: str = Field(
        ...,
        description="Detailed notes or transcript of what occurred during the interaction",
    )
    date: Optional[str] = Field(
        default=None,
        description="Date of interaction (YYYY-MM-DD)",
    )
    outcome: Optional[str] = Field(
        default=None,
        description="Outcome, next step, or resolution from the interaction",
    )
    tags: Optional[List[str]] = Field(
        default_factory=list,
        description="Keywords or tags for categorization",
    )


class OutcomeCreate(BaseModel):
    company: str = Field(..., description="Company name (e.g. ACME Corp)")
    interaction_id: Optional[str] = Field(
        default=None, description="Optional interaction ID reference"
    )
    outcome_type: str = Field(
        default="strategy_result",
        description="Type of outcome (e.g. strategy_result, objection_outcome)",
    )
    strategy: str = Field(
        ...,
        description="Specific sales strategy, proposal, or discount approach attempted",
    )
    result: str = Field(
        ...,
        description="Result of the approach: unsuccessful, successful, partial",
    )
    details: str = Field(
        ...,
        description="Detailed customer reaction, pushback reasons, or outcome specifics",
    )
    date: Optional[str] = Field(
        default=None,
        description="Date the outcome occurred (YYYY-MM-DD)",
    )
    tags: Optional[List[str]] = Field(
        default_factory=list,
        description="Additional tags (e.g. pricing, objection, discount)",
    )


@router.get("")
async def get_user_deals(
    include_demo: bool = Query(True, description="Whether to include ACME demo deal if user has no deals"),
    user: Optional[dict] = Depends(get_optional_current_user),
):
    """Retrieve all deals owned by the authenticated user."""
    conn = get_db_connection()
    cursor = conn.cursor()

    user_id = user["id"] if user else "demo-user-001"

    cursor.execute(
        "SELECT id, owner_user_id, company_name, deal_value, stage, relationship_health, created_at FROM deals WHERE owner_user_id = ? ORDER BY created_at DESC",
        (user_id,),
    )
    rows = cursor.fetchall()

    deals = [
        {
            "id": r["id"],
            "owner_user_id": r["owner_user_id"],
            "company_name": r["company_name"],
            "deal_value": r["deal_value"],
            "stage": r["stage"],
            "relationship_health": r["relationship_health"],
            "created_at": r["created_at"],
            "is_demo": r["id"] == "acme",
        }
        for r in rows
    ]

    # If new user has 0 deals and requested demo or is exploring
    if not deals and include_demo:
        cursor.execute("SELECT id, owner_user_id, company_name, deal_value, stage, relationship_health, created_at FROM deals WHERE id = 'acme'")
        demo_row = cursor.fetchone()
        if demo_row:
            deals.append({
                "id": demo_row["id"],
                "owner_user_id": demo_row["owner_user_id"],
                "company_name": demo_row["company_name"],
                "deal_value": demo_row["deal_value"],
                "stage": demo_row["stage"],
                "relationship_health": demo_row["relationship_health"],
                "created_at": demo_row["created_at"],
                "is_demo": True,
            })

    conn.close()
    return {"status": "success", "count": len(deals), "deals": deals}


@router.post("")
async def create_deal(req: DealCreate, user: dict = Depends(get_current_user)):
    """Create a new user-owned deal."""
    deal_id = f"deal_{uuid.uuid4().hex[:8]}"
    now = datetime.utcnow().isoformat()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO deals (id, owner_user_id, company_name, deal_value, stage, relationship_health, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (deal_id, user["id"], req.company_name.strip(), req.deal_value, req.stage, req.relationship_health, now),
    )
    conn.commit()
    conn.close()

    log_activity(
        user_id=user["id"],
        deal_id=deal_id,
        company=req.company_name,
        activity_type="deal_created",
        title=f"Created Deal: {req.company_name}",
        description=f"Initialized {req.company_name} (${req.deal_value:,} ARR) at stage {req.stage}.",
    )

    return {
        "status": "success",
        "message": f"Deal for {req.company_name} created successfully.",
        "deal": {
            "id": deal_id,
            "company_name": req.company_name,
            "deal_value": req.deal_value,
            "stage": req.stage,
            "relationship_health": req.relationship_health,
            "created_at": now,
        },
    }


@router.delete("/{deal_id}")
async def delete_deal(deal_id: str, user: dict = Depends(get_current_user)):
    """Delete a user-owned deal."""
    if deal_id == "acme":
        raise HTTPException(status_code=400, detail="Cannot delete default demo deal.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM deals WHERE id = ? AND owner_user_id = ?", (deal_id, user["id"]))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Deal not found or you do not have permission to delete it.")

    cursor.execute("DELETE FROM deals WHERE id = ? AND owner_user_id = ?", (deal_id, user["id"]))
    cursor.execute("DELETE FROM activities WHERE deal_id = ? AND user_id = ?", (deal_id, user["id"]))
    conn.commit()
    conn.close()

    return {"status": "success", "message": f"Deal {deal_id} deleted successfully."}


@router.post("/{deal_id}/interactions")
async def create_deal_interaction(
    deal_id: str,
    interaction: InteractionCreate,
    user: Optional[dict] = Depends(get_optional_current_user),
):
    """Store a sales interaction in Hindsight persistent memory with user isolation."""
    deal_id_clean = deal_id.strip().lower()
    bank_id = get_tenant_bank_id(deal_id_clean, user)

    interaction_date = interaction.date or datetime.utcnow().strftime("%Y-%m-%d")

    memory_narrative = (
        f"{interaction.company} ({interaction.interaction_type.upper()} on {interaction_date}): "
        f"{interaction.content} "
        f"Key Stakeholder: {interaction.contact_name} ({interaction.contact_role})."
    )
    if interaction.outcome:
        memory_narrative += f" Outcome / Next Step: {interaction.outcome}."

    context_str = f"{interaction.company} Deal History - {interaction.interaction_type.capitalize()}"

    combined_tags = [
        f"deal:{deal_id_clean}",
        f"company:{interaction.company.lower().replace(' ', '_')}",
        f"type:{interaction.interaction_type.lower()}",
    ]
    if user:
        combined_tags.append(f"user:{user['id']}")

    if interaction.tags:
        for t in interaction.tags:
            clean_tag = t.strip().lower()
            if clean_tag not in combined_tags:
                combined_tags.append(clean_tag)

    metadata = {
        "deal_id": deal_id_clean,
        "company": interaction.company,
        "contact_name": interaction.contact_name,
        "contact_role": interaction.contact_role,
        "interaction_type": interaction.interaction_type,
        "date": interaction_date,
    }

    try:
        retain_res = await hindsight_service.retain(
            bank_id=bank_id,
            content=memory_narrative,
            context=context_str,
            tags=combined_tags,
            metadata=metadata,
        )

        if user:
            log_activity(
                user_id=user["id"],
                deal_id=deal_id_clean,
                company=interaction.company,
                activity_type="interaction",
                title=f"{interaction.interaction_type.capitalize()} with {interaction.contact_name} ({interaction.contact_role})",
                description=interaction.content[:160] + ("..." if len(interaction.content) > 160 else ""),
            )

        return {
            "status": "success",
            "message": f"Interaction successfully retained for {interaction.company} ({deal_id_clean})",
            "deal_id": deal_id_clean,
            "bank_id": bank_id,
            "stored_memory": {
                "narrative": memory_narrative,
                "context": context_str,
                "tags": combined_tags,
                "metadata": metadata,
            },
            "hindsight": {
                "success": retain_res.success,
                "items_count": retain_res.items_count,
                "operation_id": retain_res.operation_id,
            },
        }
    except Exception as e:
        logger.error(f"Error retaining interaction in Hindsight: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Hindsight memory storage failed: {str(e)}",
        )


@router.post("/{deal_id}/outcomes")
async def create_deal_outcome(
    deal_id: str,
    outcome: OutcomeCreate,
    user: Optional[dict] = Depends(get_optional_current_user),
):
    """Retain a strategy outcome in Hindsight so the agent can learn what worked and what failed."""
    deal_id_clean = deal_id.strip().lower()
    bank_id = get_tenant_bank_id(deal_id_clean, user)

    outcome_date = outcome.date or datetime.utcnow().strftime("%Y-%m-%d")

    memory_narrative = (
        f"{outcome.company} SALES STRATEGY & OUTCOME RECORD ({outcome_date}): "
        f"Sales Strategy Attempted: \"{outcome.strategy}\". "
        f"Outcome Result: {outcome.result.upper()}. "
        f"Customer Reaction & Details: {outcome.details}. "
        f"Key Takeaway: The approach '{outcome.strategy}' was {outcome.result.lower()} for {outcome.company}."
    )

    context_str = f"{outcome.company} Strategy Outcomes - {outcome.result.capitalize()}"

    combined_tags = [
        f"deal:{deal_id_clean}",
        "outcome",
        "strategy",
        f"result:{outcome.result.lower()}",
        f"company:{outcome.company.lower().replace(' ', '_')}",
    ]
    if user:
        combined_tags.append(f"user:{user['id']}")

    if outcome.tags:
        for t in outcome.tags:
            clean_tag = t.strip().lower()
            if clean_tag not in combined_tags:
                combined_tags.append(clean_tag)

    metadata = {
        "deal_id": deal_id_clean,
        "company": outcome.company,
        "strategy": outcome.strategy,
        "result": outcome.result,
        "outcome_type": outcome.outcome_type,
        "date": outcome_date,
    }

    try:
        retain_res = await hindsight_service.retain(
            bank_id=bank_id,
            content=memory_narrative,
            context=context_str,
            tags=combined_tags,
            metadata=metadata,
        )

        if user:
            log_activity(
                user_id=user["id"],
                deal_id=deal_id_clean,
                company=outcome.company,
                activity_type="outcome",
                title=f"Strategy Outcome: {outcome.result.capitalize()}",
                description=f"Strategy: \"{outcome.strategy}\". Details: {outcome.details[:120]}...",
            )

        return {
            "status": "success",
            "message": f"Outcome & Strategy result successfully retained in DealMemory for {outcome.company}",
            "deal_id": deal_id_clean,
            "bank_id": bank_id,
            "stored_memory": {
                "narrative": memory_narrative,
                "strategy": outcome.strategy,
                "result": outcome.result,
                "details": outcome.details,
                "tags": combined_tags,
                "metadata": metadata,
            },
            "hindsight": {
                "success": retain_res.success,
                "items_count": retain_res.items_count,
                "operation_id": retain_res.operation_id,
            },
        }
    except Exception as e:
        logger.error(f"Error retaining outcome in Hindsight: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Hindsight outcome storage failed: {str(e)}",
        )


@router.post("/{deal_id}/learn")
async def learn_from_deal_memory(
    deal_id: str,
    user: Optional[dict] = Depends(get_optional_current_user),
):
    """Use Hindsight's reflect() reasoning engine to extract learned insights from past strategies and outcomes."""
    deal_id_clean = deal_id.strip().lower()
    bank_id = get_tenant_bank_id(deal_id_clean, user)

    learn_query = (
        f"Analyze all customer interactions, stakeholder objections, proposed sales strategies, and outcomes "
        f"recorded for {deal_id_clean}. Specifically evaluate what strategies worked, what failed (and why), "
        f"and formulate actionable learned insights to guide upcoming sales conversations."
    )

    learn_schema = {
        "type": "object",
        "properties": {
            "company": {"type": "string"},
            "learned_insights": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Clear strategic takeaways and lessons learned from past strategies and outcomes",
            },
        },
        "required": ["learned_insights"],
    }

    try:
        reflect_res = await hindsight_service.reflect(
            bank_id=bank_id,
            query=learn_query,
            budget="mid",
            response_schema=learn_schema,
            tags=[f"deal:{deal_id_clean}"],
        )

        structured = reflect_res.structured_output or {}
        learned_insights = structured.get("learned_insights", [])

        if not learned_insights and reflect_res.text:
            lines = [
                line.strip(" -*•")
                for line in reflect_res.text.split("\n")
                if line.strip().startswith(("-", "*", "•", "1.", "2.", "3.", "4."))
            ]
            learned_insights = lines if lines else [reflect_res.text.strip()]

        if user:
            log_activity(
                user_id=user["id"],
                deal_id=deal_id_clean,
                company="ACME Corp" if deal_id_clean == "acme" else deal_id_clean.upper(),
                activity_type="learning",
                title="Hindsight Reflection Generated",
                description=f"Identified {len(learned_insights)} strategic insights from historical outcomes.",
            )

        return {
            "status": "success",
            "deal_id": deal_id_clean,
            "bank_id": bank_id,
            "learned_insights": learned_insights,
            "summary": reflect_res.text,
        }
    except Exception as e:
        logger.error(f"Error executing Hindsight reflect for learning: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Hindsight learning reflection failed: {str(e)}",
        )


@router.get("/{deal_id}/prepare")
async def prepare_for_meeting(
    deal_id: str,
    user: Optional[dict] = Depends(get_optional_current_user),
):
    """Generate comprehensive AI meeting intelligence using Hindsight memory recall and reflection."""
    deal_id_clean = deal_id.strip().lower()
    bank_id = get_tenant_bank_id(deal_id_clean, user)

    prep_query = (
        f"Generate a complete, executive B2B sales meeting preparation brief for {deal_id_clean}. "
        f"Carefully evaluate: "
        f"1. Overall relationship state and recent trajectory. "
        f"2. Stakeholders, their explicit roles, requirements, and concerns. "
        f"3. Key customer risks and objections. "
        f"4. Previous sales strategies and their exact recorded outcomes (what worked vs what failed). "
        f"5. Key learned strategic insights. "
        f"6. Recommended focus areas for the next meeting. "
        f"7. Crucial pitfalls / strategies to avoid repeating based on past failures."
    )

    prep_schema = {
        "type": "object",
        "properties": {
            "company": {"type": "string"},
            "relationship_summary": {"type": "string"},
            "key_concerns": {"type": "array", "items": {"type": "string"}},
            "stakeholders": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "role": {"type": "string"},
                        "notes": {"type": "string"},
                    },
                    "required": ["name", "role"],
                },
            },
            "previous_outcomes": {"type": "array", "items": {"type": "string"}},
            "learned_insights": {"type": "array", "items": {"type": "string"}},
            "recommended_focus": {"type": "array", "items": {"type": "string"}},
            "avoid_repeating": {"type": "array", "items": {"type": "string"}},
        },
        "required": [
            "company",
            "relationship_summary",
            "key_concerns",
            "stakeholders",
            "learned_insights",
            "recommended_focus",
            "avoid_repeating",
        ],
    }

    try:
        reflect_res = await hindsight_service.reflect(
            bank_id=bank_id,
            query=prep_query,
            budget="mid",
            response_schema=prep_schema,
            tags=[f"deal:{deal_id_clean}"],
        )

        structured = reflect_res.structured_output or {}

        if user:
            log_activity(
                user_id=user["id"],
                deal_id=deal_id_clean,
                company=structured.get("company", deal_id_clean.upper()),
                activity_type="meeting_prep",
                title=f"Prepared Meeting for {structured.get('company', deal_id_clean.upper())}",
                description="Synthesized customer trajectory, past outcomes, and key pitfalls to avoid.",
            )

        return {
            "deal_id": deal_id_clean,
            "company": structured.get("company", deal_id_clean.upper()),
            "relationship_summary": structured.get(
                "relationship_summary", reflect_res.text[:300] if reflect_res.text else ""
            ),
            "key_concerns": structured.get("key_concerns", []),
            "stakeholders": structured.get("stakeholders", []),
            "previous_outcomes": structured.get("previous_outcomes", []),
            "learned_insights": structured.get("learned_insights", []),
            "recommended_focus": structured.get("recommended_focus", []),
            "avoid_repeating": structured.get("avoid_repeating", []),
            "raw_reflection": reflect_res.text,
        }
    except Exception as e:
        logger.error(f"Error preparing meeting intelligence: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Meeting preparation failed: {str(e)}",
        )


@router.get("/{deal_id}/memory")
async def get_deal_memory(
    deal_id: str,
    query: Optional[str] = Query(
        default=None,
        description="Custom query to recall specific aspects of the deal history",
    ),
    tag: Optional[str] = Query(
        default=None,
        description="Optional tag to narrow recall",
    ),
    max_tokens: int = Query(default=4096, ge=256, le=8192),
    user: Optional[dict] = Depends(get_optional_current_user),
):
    """Recall relationship history, objections, stakeholder positions, and outcomes for a deal."""
    deal_id_clean = deal_id.strip().lower()
    bank_id = get_tenant_bank_id(deal_id_clean, user)

    search_query = query or (
        f"What is the relationship history, key interactions, objections, competitors, "
        f"and outcomes for {deal_id_clean}?"
    )

    tags = [f"deal:{deal_id_clean}"]
    if tag:
        tags.append(tag.strip().lower())

    try:
        recall_res = await hindsight_service.recall(
            bank_id=bank_id,
            query=search_query,
            tags=tags,
            max_tokens=max_tokens,
            budget="mid",
        )

        memories = [
            {
                "id": r.id,
                "text": r.text,
                "type": getattr(r, "type", None),
                "context": getattr(r, "context", None),
                "tags": getattr(r, "tags", []),
                "mentioned_at": getattr(r, "mentioned_at", None),
            }
            for r in (recall_res.results or [])
        ]

        llm_prompt = (
            recall_res.to_prompt_string()
            if hasattr(recall_res, "to_prompt_string")
            else ""
        )

        return {
            "status": "success",
            "deal_id": deal_id_clean,
            "bank_id": bank_id,
            "query": search_query,
            "count": len(memories),
            "memories": memories,
            "prompt_representation": llm_prompt,
        }
    except Exception as e:
        logger.error(f"Error recalling memory from Hindsight: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Hindsight memory recall failed: {str(e)}",
        )


class AskRequest(BaseModel):
    question: str = Field(..., description="Sales representative question regarding this deal")


@router.post("/{deal_id}/ask")
async def ask_deal_agent(
    deal_id: str,
    request: AskRequest,
    user: Optional[dict] = Depends(get_optional_current_user),
):
    """Ask DealMemory Agent a relationship-intelligence question grounded in Hindsight memories and Groq LLM."""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    deal_id_clean = deal_id.strip().lower()
    bank_id = get_tenant_bank_id(deal_id_clean, user)

    try:
        # Note: we pass bank_id to agent ask
        res = await deal_memory_agent.ask(
            deal_id=deal_id_clean,
            question=request.question.strip(),
            bank_id=bank_id,
        )

        if user:
            # Store in AI conversations
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute(
                    """
                    INSERT INTO ai_conversations (id, user_id, deal_id, question, answer, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        f"conv_{uuid.uuid4().hex[:8]}",
                        user["id"],
                        deal_id_clean,
                        request.question.strip(),
                        res.get("answer", ""),
                        datetime.utcnow().isoformat(),
                    ),
                )
                conn.commit()
                conn.close()
            except Exception as e:
                logger.error(f"Failed to save AI conversation: {e}")

            log_activity(
                user_id=user["id"],
                deal_id=deal_id_clean,
                company="ACME Corp" if deal_id_clean == "acme" else deal_id_clean.upper(),
                activity_type="ai_question",
                title=f"Asked AI: \"{request.question[:45]}...\"",
                description=f"Generated grounded answer utilizing {res.get('memory_context', {}).get('count', 0)} Hindsight memories.",
            )

        return res
    except Exception as e:
        logger.error(f"Error answering question for {deal_id}: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"DealMemory agent error: {str(e)}",
        )
