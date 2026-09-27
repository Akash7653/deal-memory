import logging
from typing import Any
from hindsight_client import Hindsight, RecallResponse, RetainResponse, ReflectResponse
from hindsight_client_api.exceptions import NotFoundException, ApiException
from app.config import settings

logger = logging.getLogger(__name__)


class HindsightService:
    """Service wrapper for Hindsight by Vectorize memory operations."""

    def __init__(self, base_url: str | None = None, api_key: str | None = None):
        self.base_url = (base_url or settings.HINDSIGHT_BASE_URL).rstrip("/")
        self.api_key = api_key or settings.HINDSIGHT_API_KEY
        self._client = Hindsight(
            base_url=self.base_url,
            api_key=self.api_key if self.api_key else None,
        )

    @property
    def client(self) -> Hindsight:
        return self._client

    async def ensure_bank(self, bank_id: str) -> None:
        """Ensure that the target memory bank exists, creating it if needed."""
        try:
            await self._client.aget_bank_config(bank_id=bank_id)
        except NotFoundException:
            logger.info(f"Memory bank '{bank_id}' does not exist. Creating...")
            try:
                await self._client.acreate_bank(
                    bank_id=bank_id,
                    name=f"DealMemory Bank ({bank_id})",
                    mission="Store and recall B2B sales relationship history, stakeholder objections, sales strategies, and customer outcomes for learning.",
                )
            except Exception as create_err:
                logger.warning(f"Could not auto-create bank '{bank_id}': {create_err}")
        except Exception as e:
            logger.debug(f"Bank check for '{bank_id}' returned: {e}")

    async def retain(
        self,
        bank_id: str,
        content: str,
        context: str | None = None,
        tags: list[str] | None = None,
        metadata: dict[str, str] | None = None,
        document_id: str | None = None,
        retain_async: bool = False,
    ) -> RetainResponse:
        """Retain a sales memory or interaction in Hindsight."""
        await self.ensure_bank(bank_id)
        return await self._client.aretain(
            bank_id=bank_id,
            content=content,
            context=context,
            tags=tags,
            metadata=metadata,
            document_id=document_id,
            retain_async=retain_async,
        )

    async def recall(
        self,
        bank_id: str,
        query: str,
        tags: list[str] | None = None,
        max_tokens: int = 4096,
        budget: str = "mid",
    ) -> RecallResponse:
        """Recall relevant relationship memories based on query and optional tags."""
        await self.ensure_bank(bank_id)
        return await self._client.arecall(
            bank_id=bank_id,
            query=query,
            tags=tags,
            max_tokens=max_tokens,
            budget=budget,
        )

    async def reflect(
        self,
        bank_id: str,
        query: str,
        context: str | None = None,
        budget: str = "low",
        response_schema: dict[str, Any] | None = None,
        tags: list[str] | None = None,
    ) -> ReflectResponse:
        """Reflect on memories directly via Hindsight reasoning engine."""
        await self.ensure_bank(bank_id)
        return await self._client.areflect(
            bank_id=bank_id,
            query=query,
            context=context,
            budget=budget,
            response_schema=response_schema,
            tags=tags,
        )


hindsight_service = HindsightService()
