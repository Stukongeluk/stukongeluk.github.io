import { Component, OnInit, WritableSignal, effect, signal, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'website';
  isDarkTheme: WritableSignal<boolean> = signal(false)
  isMenuOpen: WritableSignal<boolean> = signal(false)

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen())
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      const isDark = this.isDarkTheme();
      if (isPlatformBrowser(this.platformId)) {
        this.setTheme(isDark);
      }
    })
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('color-theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.isDarkTheme.set(true);
      }
    }
  }

  changeTheme() {
    this.isDarkTheme.set(!this.isDarkTheme())
  }

  private setTheme(isDarkTheme: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('color-theme', isDarkTheme ? 'dark' : 'light')
      if (isDarkTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
}
