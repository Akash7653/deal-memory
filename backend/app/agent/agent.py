import logging
from typing import Dict, Any, List, Optional
import httpx

from app.config import settings
from app.memory.hindsight import hindsight_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are DealMemory, an AI relationship intelligence agent for B2B sales representatives.

Your job is to help a sales representative prepare for and navigate customer relationships using persistent relationship memory and learned outcomes.

You MUST format your answer clearly into these structured sections:

**Remembered Facts**
• Summarize verified facts from customer interactions, participants, and stated requirements.

**Learned Insights**
• Explain what previous strategies worked or failed and the strategic takeaway.

**Recommended Action**
• Prescribe the specific next move for the upcoming conversation.

**Why This Recommendation**
• Detail which remembered evidence and learned outcomes justify this action.

**What To Avoid**
• Explicitly warn against repeating failed tactics (e.g. discounting without quantified ROI).

CRITICAL MULTI-TENANT & ZERO-HALLUCINATION RULES:
1. Strict Tenant Isolation: You strictly operate on facts present in this company's DealMemory. Never assume, fabricate, or leak customer records, deals, stakeholders, or meeting notes from other companies.
2. Unrecorded Entity or Deal: If the user asks about an entity, company, or customer with NO record in this company's DealMemory (for example: "What do you know about ACME Corp?", "What do you know about TechNova Solutions?", "What happened in TechNova's ACME deal?"), you MUST explicitly respond:
"No verified information about {Entity} is recorded in this company's DealMemory."
3. Unrecorded Department or Topic: If the user asks about an unrecorded department, topic, or contract (e.g., "What did the legal department say about our contract?"), respond:
"DealMemory has no recorded information about the legal department in this company's DealMemory."
4. Unrecorded Pricing Failure: If the user asks why a pricing discount failed or about pricing concessions, and there is no record of that in this company's DealMemory, state:
"There is no recorded pricing failure or discount rejection in this company's available relationship data."
5. Zero Hallucination: Do not invent names, people, roles, meetings, outcomes, objections, or recommendations. If there is insufficient data, clearly state what is missing and advise recording customer interactions first.
6. Customer Isolation & Specificity: When answering about a specific customer or deal (such as Globex Industries, Globex Digital Transformation, or Rohan Mehta), strictly focus on facts and outcomes belonging to that customer. Never mention or cross-contaminate stakeholders or history from other customers (such as ACME's Sarah, David, or Michael) unless explicitly asked to compare across customers.
"""


class DealMemoryAgent:
    """Relationship-intelligence sales agent combining Hindsight memory recall/reflection and Groq LLM synthesis."""

    def __init__(self):
        self.groq_api_key = settings.GROQ_API_KEY
        self.groq_model = settings.GROQ_MODEL
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"

    async def ask(
        self,
        deal_id: str,
        question: str,
        bank_id: Optional[str] = None,
        company_name: Optional[str] = None,
        deal_name: Optional[str] = None,
        company_id: Optional[str] = None,
        is_demo: bool = False,
    ) -> Dict[str, Any]:
        """Answer a sales question grounded strictly in Hindsight memories and learned outcomes."""
        deal_id_clean = deal_id.strip().lower()
        active_bank_id = bank_id or settings.HINDSIGHT_BANK_ID or f"dealmemory-{deal_id_clean}"

        # Resolve tenant company_id for strict database isolation
        active_company_id = company_id
        if not active_company_id and active_bank_id.startswith("dealmemory-"):
            bank_suffix = active_bank_id.replace("dealmemory-", "")
            if bank_suffix.startswith("comp_"):
                active_company_id = bank_suffix

        # Determine tags: if general agent query, query full bank; otherwise query specific deal tag
        deal_tags = [f"deal:{deal_id_clean}"] if deal_id_clean not in ("agent", "general", "all", "") else None

        # ---------------------------------------------------------
        # STEP 1: HINDSIGHT RECALL
        # Retrieve relationship memories related to the question & deal
        # ---------------------------------------------------------
        recalled_memories: List[Dict[str, Any]] = []
        prompt_representation = ""
        try:
            recall_res = await hindsight_service.recall(
                bank_id=active_bank_id,
                query=question,
                tags=deal_tags,
                max_tokens=3000,
                budget="mid",
            )
            for r in (recall_res.results or []):
                recalled_memories.append({
                    "id": r.id,
                    "text": r.text,
                    "type": getattr(r, "type", None),
                    "context": getattr(r, "context", None),
                    "tags": getattr(r, "tags", []),
                })

            # If tagged recall returned 0, try recalling across the bank using semantic search on the question
            if not recalled_memories and deal_tags:
                fallback_res = await hindsight_service.recall(
                    bank_id=active_bank_id,
                    query=f"{deal_name or deal_id_clean} {question}",
                    tags=None,
                    max_tokens=3000,
                    budget="mid",
                )
                for r in (fallback_res.results or []):
                    recalled_memories.append({
                        "id": r.id,
                        "text": r.text,
                        "type": getattr(r, "type", None),
                        "context": getattr(r, "context", None),
                        "tags": getattr(r, "tags", []),
                    })
                if hasattr(fallback_res, "to_prompt_string") and recalled_memories:
                    prompt_representation = fallback_res.to_prompt_string()
            elif hasattr(recall_res, "to_prompt_string"):
                prompt_representation = recall_res.to_prompt_string()
        except Exception as e:
            logger.warning(f"Error recalling memory for {active_bank_id}: {e}")

        # Incorporate local DB interactions and outcomes to guarantee zero-latency availability with strict company isolation
        db_memories: List[str] = []
        db_outcomes: List[str] = []
        try:
            from app.db.database import get_db_connection
            conn = get_db_connection()
            cursor = conn.cursor()
            query_lower = question.lower()

            if active_company_id:
                if deal_id_clean not in ("agent", "general", "all", ""):
                    cursor.execute(
                        "SELECT contact_name, contact_role, company, interaction_type, content, outcome, date FROM interactions WHERE company_id = ? AND (deal_id = ? OR LOWER(company) LIKE ?) ORDER BY created_at DESC LIMIT 10",
                        (active_company_id, deal_id_clean, f"%{deal_id_clean}%")
                    )
                else:
                    cursor.execute(
                        "SELECT contact_name, contact_role, company, interaction_type, content, outcome, date FROM interactions WHERE company_id = ? ORDER BY created_at DESC LIMIT 5",
                        (active_company_id,)
                    )
                for row in cursor.fetchall():
                    line = f"Interaction ({row['date'] or 'Recent'}) with {row['contact_name']} ({row['contact_role']}) at {row['company']}: {row['content']}"
                    if row['outcome']:
                        line += f" | Next Step / Outcome: {row['outcome']}"
                    db_memories.append(line)

                # Check outcomes for this tenant company
                if deal_id_clean not in ("agent", "general", "all", ""):
                    cursor.execute(
                        "SELECT company, strategy, result, details, date FROM outcomes WHERE company_id = ? AND (deal_id = ? OR LOWER(company) LIKE ?) ORDER BY created_at DESC LIMIT 5",
                        (active_company_id, deal_id_clean, f"%{deal_id_clean}%")
                    )
                else:
                    cursor.execute(
                        "SELECT company, strategy, result, details, date FROM outcomes WHERE company_id = ? ORDER BY created_at DESC LIMIT 5",
                        (active_company_id,)
                    )
                for row in cursor.fetchall():
                    db_outcomes.append(
                        f"Recorded Strategy Outcome for {row['company']}: Strategy '{row['strategy']}' marked as {row['result'].upper()}. Details: {row['details']}"
                    )
            conn.close()
        except Exception as db_err:
            logger.debug(f"Error fetching DB fallback memories: {db_err}")

        # ---------------------------------------------------------
        # STEP 2: HINDSIGHT REFLECT
        # Strategic reflection on question + deal's past outcomes
        # ---------------------------------------------------------
        reflection_text = ""
        try:
            context_label = deal_name or (deal_id_clean.upper() if deal_id_clean not in ("agent", "general") else "customer relationships")
            reflect_query = (
                f"For {context_label}, answer this strategic inquiry based on past outcomes and interactions: "
                f"'{question}'. Specifically address what previous approaches failed or succeeded, and what lessons apply."
            )
            reflect_res = await hindsight_service.reflect(
                bank_id=active_bank_id,
                query=reflect_query,
                budget="mid",
                tags=deal_tags,
            )
            reflection_text = reflect_res.text or ""
            if not reflection_text and deal_tags:
                fallback_reflect = await hindsight_service.reflect(
                    bank_id=active_bank_id,
                    query=reflect_query,
                    budget="mid",
                    tags=None,
                )
                reflection_text = fallback_reflect.text or ""
        except Exception as e:
            logger.warning(f"Error during Hindsight reflect for {active_bank_id}: {e}")

        # If DB outcomes exist, enrich reflection_text
        if db_outcomes:
            outcomes_summary = "\n".join([f"• {o}" for o in db_outcomes])
            if reflection_text:
                reflection_text = f"{reflection_text}\n\nRecent Strategy Outcomes:\n{outcomes_summary}"
            else:
                reflection_text = f"Recorded Strategy Outcomes & Learned Pattern:\n{outcomes_summary}"

        # ---------------------------------------------------------
        # STEP 3: CONSTRUCT GROUNDED PROMPT FOR GROQ
        # ---------------------------------------------------------
        all_facts = []
        if recalled_memories:
            all_facts.extend([f"- {m['text']}" for m in recalled_memories])
        if db_memories:
            for dm in db_memories:
                if dm not in all_facts:
                    all_facts.append(f"- {dm}")

        if all_facts:
            prompt_representation = "FACTS:\n" + "\n".join(all_facts)
        else:
            prompt_representation = "FACTS:\n(No specific interaction memories found for this query in this company workspace)"

        context_header = deal_name or (deal_id_clean.upper() if deal_id_clean not in ("agent", "general") else "All Recorded Customer Relationships")
        user_content = f"""TENANT COMPANY: {company_name or 'Current Workspace'}
DEAL CONTEXT: {context_header}
HINDSIGHT BANK: {active_bank_id}

RECALLED RELATIONSHIP MEMORIES:
{prompt_representation}

HINDSIGHT STRATEGIC REFLECTION (Learned Outcomes & Deep Reasoning):
{reflection_text if reflection_text else '(No strategic outcomes recorded in this company workspace yet)'}

SALES REPRESENTATIVE'S QUESTION:
{question}
"""

        # ---------------------------------------------------------
        # STEP 4: GROQ SYNTHESIS
        # ---------------------------------------------------------
        answer = await self._call_groq(user_content)

        return {
            "status": "success",
            "deal_id": deal_id_clean,
            "bank_id": active_bank_id,
            "question": question,
            "answer": answer,
            "memory_context": {
                "count": len(recalled_memories) + len(db_memories),
                "memories": recalled_memories,
            },
            "learned_context": {
                "reflection_summary": reflection_text[:500] if reflection_text else "",
            },
        }

    async def _call_groq(self, user_content: str) -> str:
        """Call Groq API with streaming or JSON completion."""
        if not self.groq_api_key:
            return (
                "GROQ_API_KEY is not configured in backend/.env. "
                "Please configure GROQ_API_KEY to generate sales agent answers."
            )

        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.groq_model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            "temperature": 0.2,
            "max_tokens": 750,
        }

        models_to_try = [self.groq_model, "openai/gpt-oss-120b", "openai/gpt-oss-20b"]
        unique_models = []
        for m in models_to_try:
            if m and m not in unique_models:
                unique_models.append(m)

        async with httpx.AsyncClient(timeout=45.0) as client:
            for model_name in unique_models:
                payload["model"] = model_name
                try:
                    response = await client.post(
                        self.groq_url,
                        headers=headers,
                        json=payload,
                    )
                    if response.status_code == 200:
                        data = response.json()
                        choices = data.get("choices", [])
                        if choices:
                            return choices[0].get("message", {}).get("content", "").strip()
                    elif response.status_code == 429:
                        logger.warning(f"Groq model {model_name} rate-limited (429). Attempting fallback model...")
                        continue
                    else:
                        logger.error(f"Groq API error ({response.status_code}): {response.text}")
                except Exception as e:
                    logger.error(f"Failed to communicate with Groq using {model_name}: {e}")

            return "DealMemory Agent is currently experiencing high demand. Please try asking again in a few seconds."


deal_memory_agent = DealMemoryAgent()
