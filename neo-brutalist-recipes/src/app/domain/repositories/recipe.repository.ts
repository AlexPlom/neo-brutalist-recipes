import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';

export abstract class RecipeRepository {
  abstract getAll(): Observable<Recipe[]>;
}
