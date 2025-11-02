import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme } from '../../domain/models/theme';
import { ThemeRepository } from '../../domain/repositories/theme.repository';

@Injectable({
  providedIn: 'root',
})
export class WatchActiveThemeUseCase {
  constructor(private readonly themeRepository: ThemeRepository) {}

  execute(): Observable<Theme> {
    return this.themeRepository.watchActive();
  }
}
