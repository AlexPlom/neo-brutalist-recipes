from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .config import get_settings
from .database import get_db
from .schemas import RecipesResponse
from .service import ensure_recipes_for_date

router = APIRouter()
settings = get_settings()


@router.get("/recipes", response_model=RecipesResponse)
def read_recipes(
    country: str = "BG", db: Session = Depends(get_db)
) -> RecipesResponse:
    """Return the recipes for the current day, generating them if missing."""
    today = datetime.now(tz=settings.timezone).date()
    
    # Enforce 3 recipes for Greek cuisine as requested
    count = 3 if country == "GR" else settings.recipe_count
    
    recipes = ensure_recipes_for_date(
        db, today, country_code=country, recipe_count_override=count
    )
    return RecipesResponse(date=today, recipes=recipes)
