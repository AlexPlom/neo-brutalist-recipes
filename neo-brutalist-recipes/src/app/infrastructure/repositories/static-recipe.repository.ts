import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recipe } from '../../domain/models/recipe';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { Ingredient } from '../../domain/models/ingredient';

const createIngredients = (items: Array<[string, string]>): Ingredient[] =>
  items.map(([name, quantity]) => ({ name, quantity }));

@Injectable({
  providedIn: 'root',
})
export class StaticRecipeRepository implements RecipeRepository {
  private readonly recipes: Recipe[] = [
    new Recipe(
      'shopska-omelette',
      'Shopska Omelette',
      'Fluffy omelette with roasted peppers and sirene, inspired by the classic Bulgarian salad.',
      'Free-range eggs',
      createIngredients([
        ['Eggs', '4 large'],
        ['Bulgarian sirene cheese (or feta)', '60 g, crumbled'],
        ['Roasted red pepper', '1 small, diced'],
        ['Spring onion', '1 stalk, sliced'],
        ['Sunflower oil or butter', '1 tbsp'],
        ['Fresh parsley', '1 tbsp, chopped'],
        ['Salt & black pepper', 'to taste'],
      ]),
      [
        'Whisk the eggs with a pinch of salt and black pepper until lightly frothy.',
        'Warm the fat in a non-stick pan over medium heat, then pour in the eggs.',
        'Scatter the peppers, spring onion, and sirene over the partially set eggs, then reduce the heat.',
        'Cover and cook for 3-4 minutes until just set, then finish with parsley and fold to serve.',
      ],
      10,
      5,
      'breakfast',
      2
    ),
    new Recipe(
      'chicken-kavarma-skillet',
      'Weeknight Chicken Kavarma',
      'One-pan chicken with peppers and tomatoes echoing the flavours of Bulgarian kavarma, ready for busy evenings.',
      'Chicken thighs',
      createIngredients([
        ['Boneless chicken thighs', '500 g, cut into strips'],
        ['Yellow onion', '1 medium, sliced'],
        ['Red bell pepper', '1 large, sliced'],
        ['Tomatoes (canned or grated)', '200 g'],
        ['Paprika', '1 tsp sweet, mild'],
        ['Garlic', '2 cloves, minced'],
        ['Sunflower oil', '1 tbsp'],
        ['Fresh parsley', '2 tbsp, chopped'],
        ['Salt & black pepper', 'to taste'],
      ]),
      [
        'Season the chicken with salt, pepper, and paprika.',
        'Heat the oil in a large skillet over medium-high heat and sear the chicken for 5 minutes until golden; set aside.',
        'In the same pan, soften the onion and pepper for 3 minutes, then stir in the garlic for 30 seconds.',
        'Return the chicken, pour in the tomatoes, cover, and simmer gently for 8 minutes until the chicken is cooked through.',
        'Finish with parsley and serve with crusty bread or rice.',
      ],
      10,
      15,
      'dinner',
      4
    ),
    new Recipe(
      'tarator',
      'Chilled Tarator Soup',
      'Classic Bulgarian yogurt and cucumber soup with dill for warm days.',
      'Strained yogurt',
      createIngredients([
        ['Strained yogurt', '500 g'],
        ['Cucumber', '1 large, finely diced'],
        ['Fresh dill', '1 tbsp, chopped'],
        ['Garlic', '1 small clove, grated'],
        ['Cold water', '150 ml'],
        ['Sunflower oil', '1 tbsp'],
        ['Salt', 'to taste'],
      ]),
      [
        'Whisk the yogurt with the cold water and sunflower oil until smooth and pourable.',
        'Fold in the cucumber, dill, and garlic, then season with salt.',
        'Chill for at least 15 minutes and serve cold with crusty bread.',
      ],
      10,
      0,
      'lunch',
      4
    ),
  ];

  getAll(): Observable<Recipe[]> {
    return of(this.recipes);
  }
}
