import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit {
  displayedRole: string = "";
  roles: string[] = ['Cloud Engineer', 'DevOps Engineer', 'Full-stack Developer', 'Software Engineer'];
  roleIndex: number = 0;
  currentWordLength: number = 0;
  currentWord: string = "";
  isDeleting: boolean = false;

  ngOnInit(): void {
    this.updateDisplayRole()
  }

  public updateDisplayRole() {
    this.currentWord = this.roles[this.roleIndex];

    this.displayedRole = this.isDeleting
        ? this.currentWord.substring(0, --this.currentWordLength)
        : this.currentWord.substring(0, ++this.currentWordLength);

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
      setTimeout(() => this.updateDisplayRole(), delay);
  }
}
