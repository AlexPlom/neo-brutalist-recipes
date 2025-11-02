from datetime import datetime
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router
from .config import get_settings
from .database import Base, SessionLocal, engine
from .scheduler import create_scheduler
from .service import ensure_recipes_for_date

logger = logging.getLogger(__name__)

settings = get_settings()
app = FastAPI(title="Daily Balkan Recipes")
app.include_router(router, prefix="")

scheduler = create_scheduler()

allow_origins = settings.cors_allow_origins
if "*" in allow_origins:
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    if not scheduler.running:
        scheduler.start()
    with SessionLocal() as session:
        today = datetime.now(tz=settings.timezone).date()
        try:
            ensure_recipes_for_date(session, today)
        except Exception:
            logger.exception("Failed to generate recipes during startup")


@app.on_event("shutdown")
async def on_shutdown() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
