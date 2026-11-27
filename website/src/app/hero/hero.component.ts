import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SaiyanForm, SuperSaiyanService } from '../services/super-saiyan.service';
import { BonsaiComponent } from '../bonsai/bonsai.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, BonsaiComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  roles: string[] = ['Senior DevOps Engineer', 'Full-stack Developer', 'Cloud Engineer', 'Forward Deploy Engineer'];
  displayedRole = signal(this.roles[0]);
  roleIndex: number = 0;
  currentWordLength: number = this.roles[0].length;
  currentWord: string = this.roles[0];
  isDeleting: boolean = true;
  private typingTimer?: ReturnType<typeof setTimeout>;

  constructor(
    public superSaiyan: SuperSaiyanService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.scheduleUpdateDisplayedRole();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.typingTimer);
  }

  public updateDisplayRole() {
    this.currentWord = this.roles[this.roleIndex];

    this.displayedRole.set(this.isDeleting
      ? this.currentWord.substring(0, --this.currentWordLength)
      : this.currentWord.substring(0, ++this.currentWordLength));

    if (this.currentWordLength === 0) {
      this.isDeleting = false;
      this.incrementRoleIndex();
    } else if (this.currentWordLength === this.currentWord.length) {
      this.isDeleting = true;
    }

    this.scheduleUpdateDisplayedRole();
  }

  private incrementRoleIndex() {
    this.roleIndex = (this.roleIndex + 1) % this.roles.length;
  }

  private scheduleUpdateDisplayedRole() {
    const delay = this.currentWordLength === this.currentWord.length ? 1000 : 100;
    this.typingTimer = setTimeout(() => this.updateDisplayRole(), delay);
  }

  // Advance through Base -> SSJ -> SSJ2 -> SSJ3 -> SSG -> Base
  toggleTransformation(event: Event): void {
    this.superSaiyan.advance(event);
  }

  // Jump straight to a chosen Super Saiyan form
  selectForm(form: SaiyanForm, event: Event): void {
    this.superSaiyan.setForm(form, event);
  }

  // Power straight down to Base from any stage
  powerDown(event: Event): void {
    this.superSaiyan.powerDown(event);
  }
}
