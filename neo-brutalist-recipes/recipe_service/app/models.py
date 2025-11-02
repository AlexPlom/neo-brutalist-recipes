from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Recipe(Base):
    """Represents a generated recipe for a given day."""

    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(String(1024), nullable=False)
    protein: Mapped[str] = mapped_column(String(120), nullable=False)
    meal_type: Mapped[str] = mapped_column(String(32), nullable=False)
    serves: Mapped[int] = mapped_column(Integer, nullable=False)
    prep_time_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    cook_time_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    ingredients: Mapped[list[dict[str, str]]] = mapped_column(JSONB, nullable=False)
    instructions: Mapped[list[str]] = mapped_column(JSONB, nullable=False)
    created_for: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
