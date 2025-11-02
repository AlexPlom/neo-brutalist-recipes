export interface ThemePalette {
  readonly background: string;
  readonly surface: string;
  readonly surfaceAccent: string;
  readonly surfaceBright: string;
  readonly ink: string;
  readonly inkMuted: string;
  readonly shadow: string;
  readonly colorScheme: 'light' | 'dark';
  readonly accent?: string;
}

export interface ThemePreview {
  readonly primary: string;
  readonly secondary: string;
}

export interface Theme {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly palette: ThemePalette;
  readonly preview: ThemePreview;
  readonly description?: string;
}
