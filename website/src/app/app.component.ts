import { Component, OnInit, WritableSignal, effect, signal, Inject, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'website';
  isDarkTheme: WritableSignal<boolean> = signal(false);
  isMenuOpen: WritableSignal<boolean> = signal(false);
  isConventionPage: WritableSignal<boolean> = signal(false);

  private router = inject(Router);

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      const isDark = this.isDarkTheme();
      if (isPlatformBrowser(this.platformId)) {
        this.setTheme(isDark);
      }
    });

    // Check on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkIfConvention(event.urlAfterRedirects || event.url || '');
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIfConvention(window.location.pathname);

      const savedTheme = localStorage.getItem('color-theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.isDarkTheme.set(true);
      }
    }
  }

  private checkIfConvention(url: string) {
    this.isConventionPage.set(url.includes('convention'));
  }

  changeTheme() {
    this.isDarkTheme.set(!this.isDarkTheme());
  }

  private setTheme(isDarkTheme: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('color-theme', isDarkTheme ? 'dark' : 'light');
      if (isDarkTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
