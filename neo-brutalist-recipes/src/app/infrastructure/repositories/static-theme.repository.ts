import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Theme } from '../../domain/models/theme';
import { ThemeRepository } from '../../domain/repositories/theme.repository';

@Injectable({
  providedIn: 'root',
})
export class StaticThemeRepository extends ThemeRepository {
  private readonly storageKey = 'neo-brutalist-active-theme';
  private readonly themes: Theme[] = [
    {
      id: 'bulgarian',
      name: 'Bulgarian Sunburst',
      className: 'theme-bulgarian',
      palette: {
        background: '#f5f1e6',
        surface: '#fffdf6',
        surfaceAccent: '#fef3c7',
        surfaceBright: '#ffe066',
        ink: '#1c1c1c',
        inkMuted: 'rgba(28, 28, 28, 0.58)',
        shadow: 'rgba(28, 28, 28, 0.9)',
        colorScheme: 'light',
        accent: '#ff7043',
      },
      preview: {
        primary: '#ffe066',
        secondary: '#ff7043',
      },
      description: 'Warm sunflower yellows with rustic ink lines.',
    },
    {
      id: 'rose-pine',
      name: 'Rose Pine Dawn',
      className: 'theme-rose-pine',
      palette: {
        background: '#faf4ed',
        surface: '#f2e9e1',
        surfaceAccent: '#dfdad9',
        surfaceBright: '#ea9d34',
        ink: '#575279',
        inkMuted: 'rgba(87, 82, 121, 0.65)',
        shadow: 'rgba(87, 82, 121, 0.35)',
        colorScheme: 'light',
        accent: '#b4637a',
      },
      preview: {
        primary: '#ea9d34',
        secondary: '#b4637a',
      },
      description: 'Rose Pine Dawn palette with soft morning light and gentle ink tones.',
    },
  ];

  private readonly activeTheme$ = new BehaviorSubject<Theme>(this.themes[0]);

  constructor(@Inject(DOCUMENT) private readonly documentRef: Document) {
    super();
    const persistedTheme = this.restoreTheme();
    if (persistedTheme) {
      this.activeTheme$.next(persistedTheme);
    }
    this.applyTheme(this.activeTheme$.value);
  }

  getAll(): Observable<Theme[]> {
    return of(this.themes);
  }

  watchActive(): Observable<Theme> {
    return this.activeTheme$.asObservable();
  }

  setActive(themeId: string): void {
    const theme = this.themes.find((option) => option.id === themeId);
    if (!theme || theme.id === this.activeTheme$.value.id) {
      return;
    }

    this.activeTheme$.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const body = this.documentRef.body;
    const classList = body.classList;
    this.themes.forEach((option) => classList.remove(option.className));
    classList.add(theme.className);
    classList.add('theme-animated');

    body.style.setProperty('--background', theme.palette.background);
    body.style.setProperty('--surface', theme.palette.surface);
    body.style.setProperty('--surface-accent', theme.palette.surfaceAccent);
    body.style.setProperty('--surface-bright', theme.palette.surfaceBright);
    body.style.setProperty('--ink', theme.palette.ink);
    body.style.setProperty('--ink-muted', theme.palette.inkMuted);
    body.style.setProperty('--shadow', theme.palette.shadow);
    body.style.setProperty('color-scheme', theme.palette.colorScheme);
    this.persistTheme(theme.id);
  }

  private persistTheme(themeId: string): void {
    if (!this.isBrowser()) {
      return;
    }

    try {
      window.localStorage.setItem(this.storageKey, themeId);
    } catch {
      // ignore storage failures (e.g. privacy mode)
    }
  }

  private restoreTheme(): Theme | null {
    if (!this.isBrowser()) {
      return null;
    }

    let storedId: string | null = null;
    try {
      storedId = window.localStorage.getItem(this.storageKey);
    } catch {
      storedId = null;
    }

    if (!storedId) {
      return null;
    }

    return this.themes.find((theme) => theme.id === storedId) ?? null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
}








