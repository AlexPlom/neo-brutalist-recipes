import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf, TitleCasePipe } from '@angular/common';
import { Recipe } from '../../../domain/models/recipe';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [NgForOf, TitleCasePipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;

  get totalTime(): number {
    return this.recipe.totalTimeMinutes;
  }
}
