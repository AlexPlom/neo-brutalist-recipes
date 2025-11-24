import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../../domain/models/recipe';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

@Injectable({
  providedIn: 'root',
})
export class LoadRecipesUseCase {
  constructor(private readonly recipeRepository: RecipeRepository) { }

  execute(country: string = 'BG'): Observable<Recipe[]> {
    return this.recipeRepository.getAll(country);
  }
}
