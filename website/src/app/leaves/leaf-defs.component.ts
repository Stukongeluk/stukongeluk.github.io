import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Leaf shapes, defined once and reused by every canopy and the falling leaves
 * through <use href="#leaf-…">. Plus a few leaves drifting down the page.
 */
@Component({
  selector: 'app-leaf-defs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
      <defs>
        <symbol id="leaf-maple" viewBox="0 0 100 100">
          <path fill="currentColor"
            d="M50 4 L57 22 L66 14 L68 30 L82 20 L78 38 L96 40 L84 52 L92 62 L74 64 L78 76 L60 68 L52 72 L52 96 L48 96 L48 72 L40 68 L22 76 L26 64 L8 62 L16 52 L4 40 L22 38 L18 20 L32 30 L34 14 L43 22 Z" />
          <path fill="none" stroke="rgba(255,250,240,.28)" stroke-width="1.4" stroke-linecap="round"
            d="M50 70 L50 14 M50 62 L80 30 M50 62 L20 30 M50 66 L88 50 M50 66 L12 50" />
        </symbol>
        <symbol id="leaf-ginkgo" viewBox="0 0 100 100">
          <path fill="currentColor"
            d="M49 96 L49 62 C30 60 8 42 6 20 C22 10 38 12 46 25 L50 31 L54 25 C62 12 78 10 94 20 C92 42 70 60 51 62 L51 96 Z" />
          <path fill="none" stroke="rgba(255,250,240,.25)" stroke-width="1.2"
            d="M50 60 L22 22 M50 60 L36 16 M50 60 L64 16 M50 60 L78 22" />
        </symbol>
        <symbol id="leaf-willow" viewBox="0 0 100 100">
          <path fill="currentColor" d="M4 52 C28 30 64 28 96 46 C66 64 30 68 4 52 Z" />
          <path fill="none" stroke="rgba(255,250,240,.3)" stroke-width="1.3" d="M8 52 C36 46 62 44 92 46" />
        </symbol>
      </defs>
    </svg>
    <div class="leaf-fall" aria-hidden="true">
      <svg class="falling f1" data-tone="oak" viewBox="0 0 100 100"><use href="#leaf-maple" /></svg>
      <svg class="falling f2" data-tone="sage" viewBox="0 0 100 100"><use href="#leaf-willow" /></svg>
      <svg class="falling f3" data-tone="red" viewBox="0 0 100 100"><use href="#leaf-maple" /></svg>
      <svg class="falling f4" data-tone="moss" viewBox="0 0 100 100"><use href="#leaf-ginkgo" /></svg>
      <svg class="falling f5" data-tone="walnut" viewBox="0 0 100 100"><use href="#leaf-willow" /></svg>
    </div>
  `,
})
export class LeafDefsComponent { }
