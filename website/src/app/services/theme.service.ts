import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * Single source of truth for Daylight / Evening.
 *
 * `isDark` is what is on screen right now. The saved preference only changes when
 * the visitor uses the toggle outside Super Saiyan mode, so powering up (which
 * switches to Evening for drama) never overwrites their own choice.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(false);
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object, @Inject(DOCUMENT) private document: Document) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      // index.html already applied a saved "dark" choice before first paint.
      this.isDark.set(this.document.documentElement.classList.contains('dark'));
    }
  }

  /** The visitor's saved choice (Daylight unless they picked Evening). */
  savedIsDark(): boolean {
    try {
      return localStorage.getItem('color-theme') === 'dark';
    } catch {
      return false;
    }
  }

  /** Show a theme; `remember` stores it as the visitor's preference. */
  apply(dark: boolean, remember: boolean): void {
    this.isDark.set(dark);
    if (!this.isBrowser) return;
    this.document.documentElement.classList.toggle('dark', dark);
    if (remember) {
      try {
        localStorage.setItem('color-theme', dark ? 'dark' : 'light');
      } catch { /* private mode */ }
    }
    this.syncThemeColor();
  }

  /** Browser UI colour (address bar on phones) follows what is on screen. */
  syncThemeColor(): void {
    if (!this.isBrowser) return;
    const ss = this.document.body.classList.contains('super-saiyan-mode');
    const color = this.isDark() ? (ss ? '#120F0B' : '#1B1814') : (ss ? '#F7EBCB' : '#F5EFE6');
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  }
}
