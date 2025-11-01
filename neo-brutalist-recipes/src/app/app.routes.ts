import { Routes } from '@angular/router';
import { RecipesPageComponent } from './presentation/pages/recipes/recipes.page';

export const routes: Routes = [
  {
    path: '',
    component: RecipesPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
