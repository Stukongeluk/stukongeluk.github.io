import { Component, OnInit, WritableSignal, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HeroComponent, AboutComponent,ContactComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'website';
  isDarkTheme: WritableSignal<boolean> = signal(true ? localStorage.getItem('color-theme') === 'dark' : false)

  constructor() {
    effect(() => this.setTheme(this.isDarkTheme()))
  }

  ngOnInit(): void {
    initFlowbite();
  }

  changeTheme() {
    this.isDarkTheme.set(!this.isDarkTheme())
  }

  private setTheme(isDarkTheme: boolean) {
    localStorage.setItem('color-theme', isDarkTheme ? 'dark' : 'light')
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

