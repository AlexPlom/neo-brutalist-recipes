import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { RecipeRepository } from './domain/repositories/recipe.repository';
import { StaticRecipeRepository } from './infrastructure/repositories/static-recipe.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: RecipeRepository, useExisting: StaticRecipeRepository },
  ],
};
