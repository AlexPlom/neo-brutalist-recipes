import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { LoadRecipesUseCase } from '../../../application/use-cases/load-recipes.use-case';
import { Recipe } from '../../../domain/models/recipe';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [NgForOf, NgIf, RecipeCardComponent],
  templateUrl: './recipes.page.html',
  styleUrl: './recipes.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesPageComponent {
  private readonly loadRecipes = inject(LoadRecipesUseCase);
  private readonly recipesInternal = toSignal(this.loadRecipes.execute(), {
    initialValue: [] as Recipe[],
  });

  readonly recipes = computed(() => this.recipesInternal());
  readonly selectedRecipeId = signal<string | null>(null);
  readonly hasSelection = computed(() => this.selectedRecipeId() !== null);
  readonly featuredRecipe = computed(() => {
    const id = this.selectedRecipeId();
    return id ? this.recipes().find((recipe) => recipe.id === id) ?? null : null;
  });
  readonly otherRecipes = computed(() => {
    const id = this.selectedRecipeId();
    return id
      ? this.recipes().filter((recipe) => recipe.id !== id)
      : this.recipes();
  });

  trackByRecipe(_: number, recipe: Recipe): string {
    return recipe.id;
  }

  selectRecipe(recipeId: string): void {
    this.selectedRecipeId.update((current) =>
      current === recipeId ? null : recipeId
    );
  }
}
