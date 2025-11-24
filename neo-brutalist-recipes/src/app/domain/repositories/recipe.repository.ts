import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';

export abstract class RecipeRepository {
  abstract getAll(country?: string): Observable<Recipe[]>;
}
