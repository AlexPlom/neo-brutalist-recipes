import os
from functools import lru_cache
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError


class Settings:
    """Container for environment-driven configuration."""

    def __init__(self) -> None:
        self.database_url = os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg2://recipes:recipes@db:5432/recipes",
        )
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.recipe_count = int(os.getenv("RECIPE_COUNT", "3"))
        timezone_name = os.getenv("APP_TIMEZONE", "UTC")
        try:
            self.timezone = ZoneInfo(timezone_name)
        except ZoneInfoNotFoundError:
            self.timezone = ZoneInfo("UTC")
        origins = os.getenv("CORS_ALLOW_ORIGINS", "*")
        parsed = [origin.strip() for origin in origins.split(",") if origin.strip()]
        self.cors_allow_origins = parsed or ["*"]


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings object."""
    return Settings()
