import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CountryService } from '../../../application/services/country.service';
import { NgForOf, NgIf } from '@angular/common';
import { LoadRecipesUseCase } from '../../../application/use-cases/load-recipes.use-case';
import { Recipe } from '../../../domain/models/recipe';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RecipeDownloadService } from '../../services/recipe-download.service';
import { switchMap } from 'rxjs';

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
  private readonly downloadService = inject(RecipeDownloadService);
  private readonly countryService = inject(CountryService);

  // Expose the signal for the template
  readonly selectedCountry = this.countryService.selectedCountry;

  private readonly recipesInternal = toSignal(
    toObservable(this.selectedCountry).pipe(
      switchMap((country) => this.loadRecipes.execute(country))
    ),
    {
      initialValue: [] as Recipe[],
    }
  );

  // Limit to 3 recipes as requested
  readonly recipes = computed(() => this.recipesInternal().slice(0, 3));

  readonly selectedRecipeId = signal<string | null>(null);
  readonly hasSelection = computed(() => this.selectedRecipeId() !== null);
  readonly featuredRecipe = computed(() => {
    const id = this.selectedRecipeId();
    return id ? this.recipes().find((recipe) => recipe.id === id) ?? null : null;
  });
  readonly otherRecipes = computed(() => {
    const id = this.selectedRecipeId();
    return id ? this.recipes().filter((recipe) => recipe.id !== id) : [];
  });

  trackByRecipe(_: number, recipe: Recipe): string {
    return recipe.id;
  }

  selectRecipe(recipeId: string): void {
    this.selectedRecipeId.update((current) => (current === recipeId ? null : recipeId));
  }

  clearSelection(): void {
    this.selectedRecipeId.set(null);
  }

  download(recipe: Recipe): void {
    this.downloadService.download(recipe);
  }
}
