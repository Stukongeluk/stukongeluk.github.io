import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Hand-drawn SVG bonsai. It grows in on load (trunk and branches draw themselves,
 * foliage pads unfold), then breathes in the wind and drops the odd leaf.
 * Pure CSS animation: no JavaScript runs for it after render.
 */
@Component({
  selector: 'app-bonsai',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bonsai.component.html',
  styleUrl: './bonsai.component.css'
})
export class BonsaiComponent { }
