import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Two bonsai trunks along the page edges; section branches grow out of them. */
@Component({
  selector: 'app-trunks',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="trunk left" aria-hidden="true"></div><div class="trunk right" aria-hidden="true"></div>`,
})
export class TrunksComponent { }
