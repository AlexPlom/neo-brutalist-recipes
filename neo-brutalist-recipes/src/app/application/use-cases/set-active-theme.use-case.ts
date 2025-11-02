import { Injectable } from '@angular/core';
import { ThemeRepository } from '../../domain/repositories/theme.repository';

@Injectable({
  providedIn: 'root',
})
export class SetActiveThemeUseCase {
  constructor(private readonly themeRepository: ThemeRepository) {}

  execute(themeId: string): void {
    this.themeRepository.setActive(themeId);
  }
}
