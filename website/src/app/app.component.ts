import { Component, OnInit, OnDestroy, WritableSignal, signal, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DOCUMENT, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { SaiyanFxComponent } from './saiyan-fx/saiyan-fx.component';
import { SuperSaiyanService } from './services/super-saiyan.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SaiyanFxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'website';
  isDarkTheme: WritableSignal<boolean> = signal(false);
  isMenuOpen: WritableSignal<boolean> = signal(false);
  readonly year = new Date().getFullYear();
  /** Scroll positions (0–1) where a leaf buds on the scroll branch. */
  readonly buds = [0.12, 0.3, 0.48, 0.66, 0.84, 0.98];

  private readonly isBrowser: boolean;
  private ticking = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    viewportScroller: ViewportScroller,
    private zone: NgZone,
    private saiyan: SuperSaiyanService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // Keep section headings clear of the fixed nav bar when a nav link scrolls to them.
    viewportScroller.setOffset([0, 80]);
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    // Light (daylight) is the default; the inline script in index.html already
    // applied a saved "dark" choice before first paint.
    this.isDarkTheme.set(this.document.documentElement.classList.contains('dark'));
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
    });
    this.onScroll();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
  }

  changeTheme() {
    const isDark = !this.isDarkTheme();
    this.isDarkTheme.set(isDark);
    if (!this.isBrowser) return;
    try {
      localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
    } catch { /* private mode */ }
    // Super Saiyan mode keeps the page dark until it powers down.
    const keepDark = isDark || this.saiyan.isTransformed();
    this.document.documentElement.classList.toggle('dark', keepDark);
    if (!this.saiyan.isTransformed()) {
      this.document.querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', isDark ? '#1B1814' : '#F5EFE6');
    }
  }

  /** Feeds scroll position to the scroll branch and hero parallax, once per frame. */
  private onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.ticking = false;
      const doc = this.document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY;
      const progress = Math.min(1, Math.max(0, y / max));

      const branch = this.document.querySelector<HTMLElement>('.scroll-branch');
      if (branch) {
        branch.style.setProperty('--scroll', progress.toFixed(4));
        branch.querySelectorAll<HTMLElement>('.bud').forEach((bud, i) => {
          bud.classList.toggle('on', progress >= this.buds[i] - 0.02);
        });
      }

      // Only animate the hero parallax while the hero is on screen.
      if (y < window.innerHeight * 1.2) {
        this.document.querySelector<HTMLElement>('.ink-mountains')
          ?.style.setProperty('--scroll-px', `${y}px`);
      }
    });
  };
}
