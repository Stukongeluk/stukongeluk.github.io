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
    if (this.isDeleting) {
      this.displayedRole = this.currentWord.substring(0, this.currentWordLength-1);
      this.currentWordLength--;
      if (this.currentWordLength == 0) {
        this.isDeleting = false;
        this.roleIndex++;
        if (this.roleIndex == this.roles.length) {
          this.roleIndex = 0;
        }
      }
    } else {
      this.displayedRole = this.currentWord.substring(0, this.currentWordLength+1);
      this.currentWordLength++;
      if (this.currentWordLength == this.currentWord.length) {
        this.isDeleting = true;
      }
    }
    this.scheduleUpdateDisplayedRole()
  }

  private scheduleUpdateDisplayedRole() {
    const delayBetweenWords = 1000;
    const delayBetweenLetters = 100;
    if (this.currentWordLength == this.currentWord.length) {
      setTimeout(() => this.updateDisplayRole(), delayBetweenWords)
    } else {
      setTimeout(() => this.updateDisplayRole(), delayBetweenLetters)
    }
  }
}
