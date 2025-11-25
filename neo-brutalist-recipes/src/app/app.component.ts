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

  private readonly quotes = [
    '“A revolution is not a dinner party… it is an act of violence by which one class overthrows another.”',
    '“Political power grows out of the barrel of a gun.”',
    '“To read too many books is harmful.”',
    '“People who try to avoid struggle will eventually be crushed by it.”',
    '“The enemy advances, we retreat. The enemy camps, we harass. The enemy tires, we attack. The enemy retreats, we pursue.”',
    '“Fight no battle you are not sure of winning.”',
    '“Without destruction there can be no construction.”',
    '“Seize the day, seize the hour.”',
    '“If you want knowledge, you must take part in the practice of changing reality.”',
    '“Dare to struggle, dare to win.”',
  ];

  readonly randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
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
