import {
  ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Pt { x: number; y: number; }
interface Wood { d: string; w: number; }
interface Ellipse { cx: number; cy: number; rx: number; ry: number; cls: string; }
interface Pad { el: Ellipse[]; style: string; }
interface Fly { cx: number; cy: number; rx: number; ry: number; style: string; }
interface Branch { origin: string; wood: Wood[]; pads: Pad[]; fly: Fly[]; }

/** Seeded random numbers: every canopy differs, but the server-rendered and the
 *  browser-rendered branches are identical (no hydration mismatch). */
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

const f = (n: number) => n.toFixed(1);

/** Point on a cubic Bézier, and the first part of it split at t (de Casteljau). */
function bez(p: Pt[], t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t * t * t * p[3].x,
    y: u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y,
  };
}

function head(p: Pt[], t: number): Pt[] {
  const l = (a: Pt, b: Pt): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  const p01 = l(p[0], p[1]), p12 = l(p[1], p[2]), p23 = l(p[2], p[3]);
  const p012 = l(p01, p12), p123 = l(p12, p23);
  return [p[0], p01, p012, l(p012, p123)];
}

const cubicPath = (p: Pt[]) =>
  `M${f(p[0].x)} ${f(p[0].y)} C${f(p[1].x)} ${f(p[1].y)} ${f(p[2].x)} ${f(p[2].y)} ${f(p[3].x)} ${f(p[3].y)}`;

/**
 * Bonsai branches that grow in from both sides over the top of a section. While the
 * section is below the fold they reach across it; when it scrolls in they swing back
 * to the edges, their foliage pads peel away and a few leaves are shaken loose.
 * Purely decorative.
 */
@Component({
  selector: 'app-leaf-canopy',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="canopy" aria-hidden="true">
      @for (b of branches; track $index; let right = $odd) {
      <div class="cluster" [class.left]="!right" [class.right]="right">
        <svg class="branch-svg" viewBox="0 0 400 240" preserveAspectRatio="xMinYMin meet">
          <g class="branch" [attr.style]="b.origin">
            <g class="sway" [attr.style]="b.origin">
              @for (w of b.wood; track $index) {
              <path class="wood" [class.bark]="w.w < 0" [attr.d]="w.d" [attr.stroke-width]="w.w < 0 ? -w.w : w.w" />
              }
              @for (pad of b.pads; track $index) {
              <g class="bpad" [attr.style]="pad.style">
                @for (e of pad.el; track $index) {
                <ellipse [attr.class]="e.cls" [attr.cx]="e.cx" [attr.cy]="e.cy" [attr.rx]="e.rx" [attr.ry]="e.ry" />
                }
              </g>
              }
            </g>
          </g>
          @for (l of b.fly; track $index) {
          <ellipse class="fly bl1" [attr.cx]="l.cx" [attr.cy]="l.cy" [attr.rx]="l.rx" [attr.ry]="l.ry" [attr.style]="l.style" />
          }
        </svg>
      </div>
      }
    </div>
  `,
})
export class LeafCanopyComponent implements OnInit, OnDestroy {
  @Input() seed = 1;
  /** Kept for compatibility with existing templates (pads per branch scale with it). */
  @Input() count = 10;

  branches: Branch[] = [];
  private observer?: IntersectionObserver;
  private timer?: ReturnType<typeof setTimeout>;

  constructor(private el: ElementRef<HTMLElement>, @Inject(PLATFORM_ID) platformId: Object) {
    if (!isPlatformBrowser(platformId)) return;
    afterNextRender(() => this.setup());
  }

  ngOnInit(): void {
    this.branches = [this.grow(this.seed * 7919), this.grow(this.seed * 104729 + 13)];
  }

  private grow(seed: number): Branch {
    const r = rng(seed);
    const rootY = 70 + r() * 80;
    const len = 270 + r() * 70;
    // Main branch: a lazy S-curve growing in from the edge.
    const main: Pt[] = [
      { x: -24, y: rootY },
      { x: len * 0.3, y: rootY + 18 + r() * 46 },
      { x: len * 0.6, y: rootY - 34 - r() * 60 },
      { x: len, y: rootY - 10 + (r() - 0.5) * 60 },
    ];
    // Taper by stacking shorter, thicker strokes over the full, thin one.
    const wood: Wood[] = [
      { d: cubicPath(main), w: 4 },
      { d: cubicPath(head(main, 0.72)), w: 8 },
      { d: cubicPath(head(main, 0.4)), w: 13 },
      { d: cubicPath(head(main, 0.16)), w: 18 },
    ];
    // Bark highlight along the thick part.
    const bark = head(main, 0.5).map((p) => ({ x: p.x, y: p.y - 3 }));
    const barkPath = cubicPath(bark);

    const tips: { p: Pt; w: number }[] = [{ p: main[3], w: 92 + r() * 30 }];
    // Two or three side branches.
    const sideCount = 2 + Math.round(r());
    for (let i = 0; i < sideCount; i++) {
      const t = 0.3 + i * (0.42 / sideCount) + r() * 0.08;
      const s = bez(main, t);
      const up = (i + Math.round(r())) % 2 === 0;
      const tip = { x: s.x + 40 + r() * 55, y: s.y + (up ? -1 : 1) * (34 + r() * 36) };
      const mid = { x: s.x + (tip.x - s.x) * 0.45, y: s.y + (tip.y - s.y) * 0.15 };
      wood.push({ d: `M${f(s.x)} ${f(s.y)} Q${f(mid.x)} ${f(mid.y)} ${f(tip.x)} ${f(tip.y)}`, w: 5 + r() * 2 });
      tips.push({ p: tip, w: 62 + r() * 34 });
    }
    // A small pad hugging the main branch near its middle.
    tips.push({ p: bez(main, 0.55 + r() * 0.1), w: 52 + r() * 18 });

    const pads: Pad[] = tips.map(({ p, w }, i) => {
      const h = w * 0.36;
      const cy = p.y - h * 0.25;
      return {
        el: [
          { cx: p.x, cy: cy + h * 0.28, rx: w * 0.52, ry: h * 0.48, cls: 'bl3' },
          { cx: p.x, cy, rx: w * 0.5, ry: h * 0.55, cls: 'bl1' },
          { cx: p.x - w * 0.32, cy: cy + h * 0.08, rx: w * 0.22, ry: h * 0.32, cls: 'bl1' },
          { cx: p.x - w * 0.1, cy: cy - h * 0.34, rx: w * 0.27, ry: h * 0.3, cls: 'bl2' },
          { cx: p.x + w * 0.2, cy: cy - h * 0.22, rx: w * 0.2, ry: h * 0.25, cls: 'bl2' },
        ].map((e) => ({ ...e, cx: +f(e.cx), cy: +f(e.cy), rx: +f(e.rx), ry: +f(e.ry) })),
        style: `transform-origin:${f(p.x)}px ${f(cy + h * 0.4)}px;--pd:${120 + i * 90}ms;` +
          `--px:${f(16 + r() * 30)}px;--pr:${f((r() - 0.5) * 16)}deg;`,
      };
    });

    // Leaves that get shaken loose when the branch swings away.
    const fly: Fly[] = [];
    for (let i = 0; i < 4; i++) {
      const tip = tips[i % tips.length].p;
      fly.push({
        cx: +f(tip.x + (r() - 0.5) * 50), cy: +f(tip.y - 4 + (r() - 0.5) * 20), rx: 5, ry: 2.4,
        style: `--fd:${200 + i * 140}ms;--fx:${f(-60 - r() * 120)}px;--fy:${f(70 + r() * 110)}px;--fr:${Math.round(180 + r() * 360)}deg;`,
      });
    }

    wood.push({ d: barkPath, w: -1.6 });
    return { origin: `transform-origin:-24px ${f(rootY)}px;`, wood, pads, fly };
  }

  private setup(): void {
    const host = this.el.nativeElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (host.getBoundingClientRect().top < window.innerHeight * 0.85) return; // already on screen

    host.classList.add('leaves-closed');
    this.observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      host.classList.remove('leaves-closed');
      host.classList.add('parting');
      this.timer = setTimeout(() => host.classList.remove('parting'), 2600);
      this.observer?.disconnect();
    }, { rootMargin: '0px 0px -18% 0px' });
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearTimeout(this.timer);
  }
}
