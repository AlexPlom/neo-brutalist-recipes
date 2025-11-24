import { Injectable } from '@angular/core';
import { Recipe } from '../../domain/models/recipe';

@Injectable({ providedIn: 'root' })
export class RecipeDownloadService {
  download(recipe: Recipe): void {
    if (!recipe) {
      return;
    }
    const markdown = this.buildMarkdown(recipe, new Date());
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${this.slugify(recipe.title)}.md`;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private buildMarkdown(recipe: Recipe, generatedAt: Date): string {
    const mealType = this.titleCase(recipe.mealType);
    const ingredients = recipe.ingredients
      .map((ingredient) => {
        const quantity = ingredient.quantity?.trim();
        const name = ingredient.name.trim();
        return `- ${[quantity, name].filter(Boolean).join(' ')}`.trim();
      })
      .join('\n');

    const steps = recipe.steps
      .map((step, index) => `${index + 1}. ${step.trim()}`)
      .join('\n');

    const footer = `${this.formatDate(generatedAt)} - Neo Brutalist Kitchen`;

    return [
      `# ${recipe.title}`,
      '',
      recipe.summary,
      '',
      `- **Meal Type:** ${mealType}`,
      `- **Protein:** ${recipe.proteinSource}`,
      `- **Serves:** ${recipe.serves}`,
      `- **Prep Time:** ${recipe.prepTimeMinutes} minutes`,
      `- **Cook Time:** ${recipe.cookTimeMinutes} minutes`,
      `- **Total Time:** ${recipe.totalTimeMinutes} minutes`,
      '',
      '## Ingredients',
      ingredients,
      '',
      '## Instructions',
      steps,
      '',
      footer,
      '',
    ].join('\n');
  }

  private slugify(value: string): string {
    return (value || 'recipe')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-')
      .trim() || 'recipe';
  }

  private titleCase(value: string): string {
    if (!value) {
      return '';
    }
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
}
