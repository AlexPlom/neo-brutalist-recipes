from __future__ import annotations

from datetime import date
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .langgraph_pipeline import generate_recipes_for_date
from .models import Recipe
from .schemas import RecipeRead

settings = get_settings()


def _normalize_meal_type(value: str) -> str:
    normalized = value.strip().lower()
    if normalized not in {"breakfast", "lunch", "dinner"}:
        return "dinner"
    return normalized


def _normalize_ingredients(raw_ingredients: list) -> list[dict[str, str]]:
    normalized: list[dict[str, str]] = []
    for entry in raw_ingredients:
        if isinstance(entry, dict):
            name = str(entry.get("name", "")).strip()
            quantity = str(entry.get("quantity", "")).strip()
        else:
            text = str(entry).strip()
            if " - " in text:
                quantity, name = text.split(" - ", 1)
            elif ": " in text:
                name, quantity = text.split(": ", 1)
            else:
                quantity, name = "", text
        if not name:
            continue
        normalized.append({"name": name, "quantity": quantity})
    if not normalized:
        raise ValueError("Generated recipe has no valid ingredients.")
    return normalized


def _coerce_int(value: object, default: int, minimum: int = 0) -> int:
    try:
        parsed = int(str(value).strip())
    except (AttributeError, ValueError, TypeError):
        return default
    return max(parsed, minimum)


def _model_to_schema(model: Recipe) -> RecipeRead:
    return RecipeRead(
        id=model.id,
        title=model.title,
        summary=model.summary,
        protein=model.protein,
        meal_type=model.meal_type,
        serves=model.serves,
        prep_time_minutes=model.prep_time_minutes,
        cook_time_minutes=model.cook_time_minutes,
        ingredients=model.ingredients,
        instructions=model.instructions,
        country_code=model.country_code,
        created_for=model.created_for,
    )


def fetch_recipes(db: Session, target_date: date, country_code: str = "BG") -> List[RecipeRead]:
    """Return stored recipes for a given date."""
    result = db.execute(
        select(Recipe)
        .where(Recipe.created_for == target_date)
        .where(Recipe.country_code == country_code)
        .order_by(Recipe.id)
    )
    return [_model_to_schema(row[0]) for row in result.all()]


def ensure_recipes_for_date(
    db: Session,
    target_date: date,
    country_code: str = "BG",
    recipe_count_override: int | None = None,
) -> List[RecipeRead]:
    """Retrieve recipes if present, otherwise generate and persist them."""
    recipes = fetch_recipes(db, target_date, country_code)
    if recipes:
        return recipes

    count = recipe_count_override if recipe_count_override is not None else settings.recipe_count
    generated = generate_recipes_for_date(target_date, count, country_code)
    persisted: List[RecipeRead] = []

    for item in generated[:count]:
        ingredients_raw = item.get("ingredients")
        instructions_raw = item.get("instructions")
        if not isinstance(ingredients_raw, list) or not ingredients_raw:
            raise ValueError("Generated recipe is missing ingredients.")
        if not isinstance(instructions_raw, list) or not instructions_raw:
            raise ValueError("Generated recipe is missing instructions.")

        ingredients = _normalize_ingredients(ingredients_raw)
        instructions = [str(step).strip() for step in instructions_raw if str(step).strip()]
        if not instructions:
            raise ValueError("Generated recipe has no valid instructions.")

        prep_time = max(_coerce_int(item.get("prep_time_minutes"), default=15), 5)
        cook_time = max(_coerce_int(item.get("cook_time_minutes"), default=20), 5)
        if prep_time + cook_time > 45:
            prep_time, cook_time = 15, 20

        recipe_model = Recipe(
            title=item["title"].strip(),
            summary=item["summary"].strip(),
            protein=item["protein"].strip(),
            meal_type=_normalize_meal_type(item.get("meal_type", "")),
            serves=_coerce_int(item.get("serves"), default=2, minimum=1),
            prep_time_minutes=prep_time,
            cook_time_minutes=cook_time,
            ingredients=ingredients,
            instructions=instructions,
            country_code=country_code,
            created_for=target_date,
        )
        db.add(recipe_model)
        db.flush()
        persisted.append(_model_to_schema(recipe_model))

    db.commit()
    return persisted
