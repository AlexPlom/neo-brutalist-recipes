from datetime import date
from typing import List

from pydantic import BaseModel, Field


class Ingredient(BaseModel):
    name: str
    quantity: str


class RecipeBase(BaseModel):
    title: str
    summary: str
    protein: str = Field(..., description="Primary protein source in the recipe")
    meal_type: str = Field(..., description="Meal type: breakfast, lunch, or dinner")
    serves: int = Field(..., ge=1)
    prep_time_minutes: int = Field(..., ge=0)
    cook_time_minutes: int = Field(..., ge=0)
    ingredients: List[Ingredient]
    instructions: List[str]


class RecipeRead(RecipeBase):
    id: int
    created_for: date


class RecipesResponse(BaseModel):
    date: date
    recipes: List[RecipeRead]
