import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Theme } from './domain/models/theme';
import { GetThemesUseCase } from './application/use-cases/get-themes.use-case';
import { WatchActiveThemeUseCase } from './application/use-cases/watch-active-theme.use-case';
import { SetActiveThemeUseCase } from './application/use-cases/set-active-theme.use-case';
import { CountryService } from './application/services/country.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly currentYear = new Date().getFullYear();
  private readonly getThemes = inject(GetThemesUseCase);
  private readonly watchActiveTheme = inject(WatchActiveThemeUseCase);
  private readonly setActiveTheme = inject(SetActiveThemeUseCase);
  readonly countryService = inject(CountryService);

  readonly themes = toSignal(this.getThemes.execute(), {
    initialValue: [] as Theme[],
  });
  readonly activeTheme = toSignal(this.watchActiveTheme.execute());

  cycleTheme(event?: MouseEvent): void {
    event?.preventDefault();
    const available = this.themes();
    if (!available || available.length === 0) {
      return;
    }
    const active = this.activeTheme();
    const currentIndex = active
      ? available.findIndex((theme) => theme.id === active.id)
      : -1;
    const nextTheme = available[(currentIndex + 1) % available.length];
    this.setActiveTheme.execute(nextTheme.id);
  }
}
