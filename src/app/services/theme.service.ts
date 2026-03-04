import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';
  
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  private getInitialTheme(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored !== null) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }

  setDarkMode(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }
}
