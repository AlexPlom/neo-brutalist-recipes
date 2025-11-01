import { Ingredient } from './ingredient';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export class Recipe {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly summary: string,
    readonly proteinSource: string,
    readonly ingredients: Ingredient[],
    readonly steps: string[],
    readonly prepTimeMinutes: number,
    readonly cookTimeMinutes: number,
    readonly mealType: MealType,
    readonly serves: number
  ) {
    if (!id) {
      throw new Error('Recipe id is required');
    }

    if (!title) {
      throw new Error('Recipe title is required');
    }

    if (!proteinSource) {
      throw new Error('Recipe protein source is required');
    }

    if (ingredients.length === 0) {
      throw new Error('Recipe ingredients are required');
    }

    if (steps.length === 0) {
      throw new Error('Recipe steps are required');
    }
  }

  get totalTimeMinutes(): number {
    return this.prepTimeMinutes + this.cookTimeMinutes;
  }
}
