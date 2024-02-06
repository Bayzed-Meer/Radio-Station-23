import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

enum THEME_CLASS {
  DARK_THEME = 'dark-theme',
  LIGHT_THEME = 'light-theme',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeSwitcherService {
  private themeChangesSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(this.isLightMode);

  themeChanges: Observable<boolean> = this.themeChangesSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.setTheme(this.isLightMode);
  }

  get isLightMode(): boolean {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  }

  setTheme(isLightMode: boolean) {
    const theme = isLightMode
      ? THEME_CLASS.DARK_THEME
      : THEME_CLASS.LIGHT_THEME;
    this.removeThemeClass(
      !isLightMode ? THEME_CLASS.DARK_THEME : THEME_CLASS.LIGHT_THEME
    );
    this.document.body.classList.add(theme);

    this.themeChangesSubject.next(!isLightMode);
  }

  private removeThemeClass(theme: THEME_CLASS) {
    if (this.document.body.classList.contains(theme)) {
      this.document.body.classList.remove(theme);
    }
  }
}
