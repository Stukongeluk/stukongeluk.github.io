import {
  ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type LeafType = 'maple' | 'ginkgo' | 'willow';
type LeafTone = 'moss' | 'sage' | 'oak' | 'walnut' | 'red';

interface Leaf {
  type: LeafType;
  tone: LeafTone;
  far: boolean;
  style: string;
}

/** Small seeded random generator, so every canopy looks different but the
 *  server-rendered and browser-rendered leaves are identical. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(r: number, options: [T, number][]): T {
  const total = options.reduce((s, [, w]) => s + w, 0);
  let x = r * total;
  for (const [v, w] of options) {
    if ((x -= w) <= 0) return v;
  }
  return options[options.length - 1][0];
}

/**
 * Layered foliage that hangs over the top edge of a section. While the section is
 * still below the fold the two clusters meet in the middle; when it scrolls in they
 * part to the sides to reveal it, and keep swaying. Purely decorative.
 */
@Component({
  selector: 'app-leaf-canopy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="canopy" aria-hidden="true">
      <div class="cluster left">
        @for (leaf of left; track $index) {
        <svg class="leaf" [class.far]="leaf.far" [attr.data-tone]="leaf.tone" [attr.style]="leaf.style" viewBox="0 0 100 100"><use [attr.href]="'#leaf-' + leaf.type" /></svg>
        }
      </div>
      <div class="cluster right">
        @for (leaf of right; track $index) {
        <svg class="leaf" [class.far]="leaf.far" [attr.data-tone]="leaf.tone" [attr.style]="leaf.style" viewBox="0 0 100 100"><use [attr.href]="'#leaf-' + leaf.type" /></svg>
        }
      </div>
    </div>
  `,
})
export class LeafCanopyComponent implements OnInit, OnDestroy {
  @Input() seed = 1;
  @Input() count = 10;

  left: Leaf[] = [];
  right: Leaf[] = [];
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, @Inject(PLATFORM_ID) platformId: Object) {
    if (!isPlatformBrowser(platformId)) return;
    afterNextRender(() => this.setup());
  }

  ngOnInit(): void {
    this.left = this.grow(this.seed * 7919, false);
    this.right = this.grow(this.seed * 104729 + 13, true);
  }

  private grow(seed: number, mirror: boolean): Leaf[] {
    const r = rng(seed);
    const leaves: Leaf[] = [];
    for (let i = 0; i < this.count; i++) {
      const far = r() < 0.4;
      const type = pick<LeafType>(r(), [['maple', 45], ['ginkgo', 25], ['willow', 30]]);
      const tone = pick<LeafTone>(r(), [['moss', 36], ['sage', 28], ['oak', 18], ['walnut', 12], ['red', 6]]);
      // Most leaves sit near the outer edge and near the top of the band.
      const x = Math.pow(r(), 1.3) * 70;
      const y = Math.pow(r(), 1.4) * 190;
      const size = far ? 30 + r() * 38 : 46 + r() * 64;
      const rot = Math.round(r() * 360);
      const delay = Math.round(r() * 450);
      const sway = (4.5 + r() * 4).toFixed(1);
      const depth = far ? (0.4 + r() * 0.3).toFixed(2) : (1 + r() * 0.6).toFixed(2);
      const side = mirror ? 'right' : 'left';
      leaves.push({
        type, tone, far,
        style: `${side}:${x.toFixed(1)}%;top:${y.toFixed(0)}px;width:${size.toFixed(0)}px;` +
          `--r:${rot}deg;--d:${delay}ms;--sway:${sway}s;--z:${depth};`
      });
    }
    // Far leaves first so the near ones are painted on top of them.
    return leaves.sort((a, b) => Number(b.far) - Number(a.far));
  }

  private setup(): void {
    const host = this.el.nativeElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = host.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) return; // already on screen: stay open

    host.classList.add('leaves-closed');
    this.observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        host.classList.remove('leaves-closed');
        this.observer?.disconnect();
      }
    }, { rootMargin: '0px 0px -18% 0px' });
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
