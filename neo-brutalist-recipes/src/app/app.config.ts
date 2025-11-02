import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { RecipeRepository } from './domain/repositories/recipe.repository';
import { ApiRecipeRepository } from './infrastructure/repositories/api-recipe.repository';
import { ThemeRepository } from './domain/repositories/theme.repository';
import { StaticThemeRepository } from './infrastructure/repositories/static-theme.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    { provide: RecipeRepository, useExisting: ApiRecipeRepository },
    { provide: ThemeRepository, useExisting: StaticThemeRepository },
  ],
};
