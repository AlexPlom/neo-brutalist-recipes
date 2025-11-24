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
    {
      id: 'midnight-veliko',
      name: 'Midnight Veliko',
      className: 'theme-midnight-veliko',
      palette: {
        background: '#120825',
        surface: '#1c1033',
        surfaceAccent: '#251a42',
        surfaceBright: '#9f7bff',
        ink: '#f4f1ff',
        inkMuted: 'rgba(244, 241, 255, 0.72)',
        shadow: 'rgba(9, 3, 26, 0.7)',
        colorScheme: 'dark',
        accent: '#d2a6ff',
      },
      preview: {
        primary: '#9f7bff',
        secondary: '#d2a6ff',
      },
      description: 'Veliko Tarnovo after midnight, washed in amethyst haze and soft lavender lights.',
    },
    {
      id: 'danube-dusk',
      name: 'Danube Dusk',
      className: 'theme-danube-dusk',
      palette: {
        background: '#121015',
        surface: '#1b161f',
        surfaceAccent: '#241e2c',
        surfaceBright: '#ff6b6b',
        ink: '#f8f5ff',
        inkMuted: 'rgba(248, 245, 255, 0.7)',
        shadow: 'rgba(0, 0, 0, 0.68)',
        colorScheme: 'dark',
        accent: '#ff9770',
      },
      preview: {
        primary: '#ff6b6b',
        secondary: '#ff9770',
      },
      description: 'Moody riverfront evening awash in coral sunset highlights and deep plum shadows.',
    },
    {
      id: 'balkan-evergreen',
      name: 'Balkan Evergreen',
      className: 'theme-balkan-evergreen',
      palette: {
        background: '#0f181d',
        surface: '#16242b',
        surfaceAccent: '#1f353e',
        surfaceBright: '#2fbf71',
        ink: '#ecf3f8',
        inkMuted: 'rgba(236, 243, 248, 0.68)',
        shadow: 'rgba(5, 12, 18, 0.75)',
        colorScheme: 'dark',
        accent: '#61d3a5',
      },
      preview: {
        primary: '#2fbf71',
        secondary: '#61d3a5',
      },
      description: 'Cool mountain pine forest with luminous mineral greens against nightfall blues.',
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








