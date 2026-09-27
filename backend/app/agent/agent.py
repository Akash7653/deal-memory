import logging
from typing import Dict, Any, List, Optional
import httpx

from app.config import settings
from app.memory.hindsight import hindsight_service

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are DealMemory, an AI relationship intelligence agent for B2B sales representatives.

Your job is to help a sales representative prepare for and navigate customer relationships.

You have access to persistent relationship memory and learned outcomes.

Always ground your recommendations in the provided customer history.

Pay special attention to:
- stakeholder concerns
- objections
- previous strategies
- successful approaches
- failed approaches
- competitors
- commitments
- relationship changes
- recent developments

CRITICAL RULES:
1. Do not invent customer facts. If the provided relationship memories do not contain information related to the question (e.g., an unmentioned department like legal, unrecorded terms, or unverified promises), explicitly and directly state that DealMemory has no record of this in the relationship history.
2. When previous strategies failed, explicitly warn the sales representative against repeating them.
3. When recommending an action, explain which remembered evidence supports it.
4. Clearly distinguish between:
   - Remembered Facts: What actually happened and who said what.
   - Learned Insights: Why previous strategies worked or failed.
   - Recommendations: What the salesperson should do next.

Your objective is not merely to summarize CRM history. Your objective is to help the salesperson make the next interaction more informed because the system remembers what happened before."""


class DealMemoryAgent:
    """Relationship-intelligence sales agent combining Hindsight memory recall/reflection and Groq LLM synthesis."""

    def __init__(self):
        self.groq_api_key = settings.GROQ_API_KEY
        self.groq_model = settings.GROQ_MODEL
        self.groq_url = "https://api.groq.com/openai/v1/chat/completions"

    async def ask(self, deal_id: str, question: str) -> Dict[str, Any]:
        """Answer a sales question grounded strictly in Hindsight memories and learned outcomes."""
        deal_id_clean = deal_id.strip().lower()
        bank_id = settings.HINDSIGHT_BANK_ID or f"dealmemory-{deal_id_clean}"

        # ---------------------------------------------------------
        # STEP 1: HINDSIGHT RECALL
        # Retrieve relationship memories related to the question & deal
        # ---------------------------------------------------------
        recalled_memories: List[Dict[str, Any]] = []
        prompt_representation = ""
        try:
            recall_res = await hindsight_service.recall(
                bank_id=bank_id,
                query=question,
                tags=[f"deal:{deal_id_clean}"],
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
            if hasattr(recall_res, "to_prompt_string"):
                prompt_representation = recall_res.to_prompt_string()
        except Exception as e:
            logger.warning(f"Error recalling memory for {deal_id_clean}: {e}")

        # ---------------------------------------------------------
        # STEP 2: HINDSIGHT REFLECT
        # Strategic reflection on question + deal's past outcomes
        # ---------------------------------------------------------
        reflection_text = ""
        try:
            reflect_query = (
                f"For deal '{deal_id_clean}', answer this strategic inquiry based on past outcomes and interactions: "
                f"'{question}'. Specifically address what previous approaches failed or succeeded, and what lessons apply."
            )
            reflect_res = await hindsight_service.reflect(
                bank_id=bank_id,
                query=reflect_query,
                budget="mid",
                tags=[f"deal:{deal_id_clean}"],
            )
            reflection_text = reflect_res.text or ""
        except Exception as e:
            logger.warning(f"Error during Hindsight reflect for {deal_id_clean}: {e}")

        # ---------------------------------------------------------
        # STEP 3: CONSTRUCT GROUNDED PROMPT FOR GROQ
        # ---------------------------------------------------------
        if not prompt_representation:
            if recalled_memories:
                facts = "\n".join([f"- {m['text']}" for m in recalled_memories])
                prompt_representation = f"FACTS:\n{facts}"
            else:
                prompt_representation = "FACTS:\n(No specific interaction memories found for this query)"

        user_content = f"""DEAL IDENTIFIER: {deal_id_clean.upper()}

RECALLED RELATIONSHIP MEMORIES (Hindsight):
{prompt_representation}

HINDSIGHT STRATEGIC REFLECTION (Learned Outcomes & Deep Reasoning):
{reflection_text if reflection_text else '(No strategic outcomes recorded yet)'}

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
            "question": question,
            "answer": answer,
            "memory_context": {
                "count": len(recalled_memories),
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
            "max_tokens": 1024,
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
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
                    return "No content received from Groq."
                else:
                    logger.error(f"Groq API error ({response.status_code}): {response.text}")
                    return f"Error from Groq API ({response.status_code}): {response.text}"
            except Exception as e:
                logger.error(f"Failed to communicate with Groq: {e}")
                return f"Communication error with Groq: {str(e)}"


deal_memory_agent = DealMemoryAgent()
