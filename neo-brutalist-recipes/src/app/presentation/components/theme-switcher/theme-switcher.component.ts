import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgForOf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Theme } from '../../../domain/models/theme';
import { GetThemesUseCase } from '../../../application/use-cases/get-themes.use-case';
import { WatchActiveThemeUseCase } from '../../../application/use-cases/watch-active-theme.use-case';
import { SetActiveThemeUseCase } from '../../../application/use-cases/set-active-theme.use-case';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  private readonly getThemes = inject(GetThemesUseCase);
  private readonly watchActiveTheme = inject(WatchActiveThemeUseCase);
  private readonly setActiveTheme = inject(SetActiveThemeUseCase);

  readonly themes = toSignal(this.getThemes.execute(), {
    initialValue: [] as Theme[],
  });
  readonly activeTheme = toSignal(this.watchActiveTheme.execute());

  isActive(themeId: string): boolean {
    return this.activeTheme()?.id === themeId;
  }

  selectTheme(themeId: string): void {
    this.setActiveTheme.execute(themeId);
  }

  trackByTheme(_: number, theme: Theme): string {
    return theme.id;
  }
}
