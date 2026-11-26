import { Component, WritableSignal, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { SaiyanFxComponent } from './saiyan-fx/saiyan-fx.component';
import { LeafDefsComponent } from './leaves/leaf-defs.component';
import { SuperSaiyanService } from './services/super-saiyan.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SaiyanFxComponent, LeafDefsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'website';
  isMenuOpen: WritableSignal<boolean> = signal(false);
  readonly year = new Date().getFullYear();

  constructor(
    viewportScroller: ViewportScroller,
    private saiyan: SuperSaiyanService,
    public theme: ThemeService
  ) {
    // Keep section headings clear of the fixed nav bar when a nav link scrolls to them.
    viewportScroller.setOffset([0, 80]);
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  changeTheme() {
    // In Super Saiyan mode the toggle switches between gold-on-ink and
    // gold-on-paper without changing the saved preference.
    this.theme.apply(!this.theme.isDark(), !this.saiyan.isTransformed());
  }
}
