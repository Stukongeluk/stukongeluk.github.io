import { Component } from '@angular/core';
import { RevealDirective } from '../shared/reveal.directive';
import { LeafCanopyComponent } from '../leaves/leaf-canopy.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective, LeafCanopyComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
