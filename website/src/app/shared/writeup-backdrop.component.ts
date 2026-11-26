import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Decorative backdrop for the project write-up headers: a brush ensō that draws
 * itself on load and a low ink-wash ridge, matching the homepage hero.
 */
@Component({
  selector: 'app-writeup-backdrop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="wb-enso" viewBox="0 0 200 200" aria-hidden="true">
      <path pathLength="1"
        d="M150 40 C120 14 62 18 36 58 C10 98 28 158 82 176 C136 194 186 152 182 98 C180 72 168 56 156 48" />
    </svg>
    <svg class="wb-ridge" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
      <path class="r1" d="M0 120 C160 90 260 60 400 74 C520 86 600 40 740 44 C880 48 960 100 1100 96 C1240 92 1330 70 1440 64 V160 H0 Z" />
      <path class="r2" d="M0 150 C200 128 340 118 520 132 C700 146 820 120 1000 126 C1180 132 1320 146 1440 140 V160 H0 Z" />
    </svg>
  `,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .wb-enso {
      position: absolute;
      right: max(-6rem, -8vw);
      top: 50%;
      width: min(520px, 60vw);
      transform: translateY(-50%) rotate(-14deg);
      overflow: visible;
    }

    .wb-enso path {
      fill: none;
      stroke: rgb(var(--accent-400) / 0.22);
      stroke-width: 9;
      stroke-linecap: round;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: wb-draw 2s cubic-bezier(.2, .7, .2, 1) 0.2s forwards;
    }

    @keyframes wb-draw {
      to { stroke-dashoffset: 0; }
    }

    .wb-ridge {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 90px;
    }

    .r1 { fill: rgba(110, 98, 84, 0.07); }
    .r2 { fill: var(--paper); }

    :host-context(html.dark) .r1 { fill: rgba(218, 205, 186, 0.05); }

    :host-context(body.super-saiyan-mode) .wb-enso path {
      stroke: rgba(255, 196, 0, 0.45);
      filter: drop-shadow(0 0 10px rgba(255, 180, 0, 0.6));
    }

    @media (prefers-reduced-motion: reduce) {
      .wb-enso path { animation: none; stroke-dashoffset: 0; }
    }
  `]
})
export class WriteupBackdropComponent { }
