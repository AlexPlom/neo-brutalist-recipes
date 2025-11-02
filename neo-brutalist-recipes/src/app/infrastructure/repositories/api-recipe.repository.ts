import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Recipe, MealType } from '../../domain/models/recipe';
import { Ingredient } from '../../domain/models/ingredient';

type ApiMealType = 'breakfast' | 'lunch' | 'dinner';

interface ApiIngredientDto {
  readonly name: string;
  readonly quantity: string;
}

interface ApiRecipeDto {
  readonly id: number;
  readonly title: string;
  readonly summary: string;
  readonly protein: string;
  readonly meal_type: ApiMealType;
  readonly serves: number;
  readonly prep_time_minutes: number;
  readonly cook_time_minutes: number;
  readonly ingredients: ApiIngredientDto[];
  readonly instructions: string[];
}

interface ApiRecipesResponse {
  readonly date: string;
  readonly recipes: ApiRecipeDto[];
}

const DEFAULT_API_BASE = 'http://72.61.181.106:8000';

@Injectable({
  providedIn: 'root',
})
export class ApiRecipeRepository implements RecipeRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.resolveBaseUrl();

  getAll(): Observable<Recipe[]> {
    return this.http.get<ApiRecipesResponse>(`${this.baseUrl}/recipes`).pipe(
      map((response) => response.recipes.map((recipe) => this.mapRecipe(recipe))),
      catchError((error) =>
        throwError(
          () =>
            new Error(
              `Failed to load recipes from API (${error.status ?? 'network'}).`
            )
        )
      )
    );
  }

  private resolveBaseUrl(): string {
    const metaEnv = (import.meta as { env?: Record<string, string | undefined> })?.env;
    const globalEnv = globalThis as Record<string, unknown>;

    const raw =
      (metaEnv?.['NG_APP_RECIPES_API'] as string | undefined) ??
      (metaEnv?.['NG_APP_RECIPES_API_URL'] as string | undefined) ??
      (globalEnv['NG_APP_RECIPES_API'] as string | undefined) ??
      (globalEnv['NG_APP_RECIPES_API_URL'] as string | undefined) ??
      DEFAULT_API_BASE;

    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }

  private mapRecipe(dto: ApiRecipeDto): Recipe {
    return new Recipe(
      String(dto.id),
      dto.title,
      dto.summary,
      dto.protein,
      dto.ingredients.map((ingredient) => this.mapIngredient(ingredient)),
      dto.instructions,
      dto.prep_time_minutes,
      dto.cook_time_minutes,
      this.normalizeMealType(dto.meal_type),
      dto.serves
    );
  }

  private mapIngredient(dto: ApiIngredientDto): Ingredient {
    return {
      name: dto.name,
      quantity: dto.quantity,
    };
  }

  private normalizeMealType(type: string): MealType {
    switch (type.toLowerCase()) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return type.toLowerCase() as MealType;
      default:
        return 'dinner';
    }
  }
}
