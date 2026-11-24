import { Component, OnDestroy, OnInit, Inject, NgZone, PLATFORM_ID, signal } from '@angular/core';
import { NgOptimizedImage, NgClass, isPlatformBrowser } from '@angular/common';
import { SuperSaiyanService } from '../services/super-saiyan.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage, NgClass],
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
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // The typing loop never ends. Run it outside Angular's zone so the app can
      // become stable: until it does, the router skips scrolling to #about,
      // #projects and #contact on a page that was loaded directly.
      this.ngZone.runOutsideAngular(() => this.scheduleUpdateDisplayedRole());
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

  // Toggle Super Saiyan transformation using the shared service
  toggleTransformation(): void {
    this.superSaiyan.toggle();
  }
}
