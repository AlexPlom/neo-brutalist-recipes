import { Observable } from 'rxjs';
import { Theme } from '../models/theme';

export abstract class ThemeRepository {
  abstract getAll(): Observable<Theme[]>;
  abstract watchActive(): Observable<Theme>;
  abstract setActive(themeId: string): void;
}
