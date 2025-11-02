from __future__ import annotations

from datetime import datetime
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from .config import get_settings
from .database import SessionLocal
from .service import ensure_recipes_for_date

settings = get_settings()
logger = logging.getLogger(__name__)


def _midnight_job() -> None:
    today = datetime.now(tz=settings.timezone).date()
    with SessionLocal() as session:
        try:
            ensure_recipes_for_date(session, today)
        except Exception:
            logger.exception("Failed to generate recipes for %s", today)


def create_scheduler() -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler(timezone=settings.timezone)
    scheduler.add_job(_midnight_job, "cron", hour=0, minute=0, id="daily-recipes")
    return scheduler
