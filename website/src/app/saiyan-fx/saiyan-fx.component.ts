import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID,
  ViewChild, effect, signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SAIYAN_TIMING, SaiyanPhase, SuperSaiyanService } from '../services/super-saiyan.service';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; hue: number;
}

/**
 * Full-screen overlay for the Super Saiyan transformation: energy gathering into the
 * portrait, a screen flash + shockwave, a scouter reading, and golden ki rising while
 * transformed. Everything runs outside Angular's zone and only while it is visible.
 */
@Component({
  selector: 'app-saiyan-fx',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './saiyan-fx.component.html',
  styleUrl: './saiyan-fx.component.css'
})
export class SaiyanFxComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('power') private powerRef?: ElementRef<HTMLElement>;

  /** Drives the CSS classes of the overlay layers. */
  stage = signal<'idle' | 'charging' | 'burst' | 'aura' | 'revert'>('idle');
  scouter = signal<'hidden' | 'counting' | 'over'>('hidden');

  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private raf = 0;
  private mode: 'off' | 'gather' | 'ambient' = 'off';
  private dpr = 1;
  private w = 0;
  private h = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private readonly isBrowser: boolean;
  private reducedMotion = false;
  private prevPhase: SaiyanPhase = 'idle';

  constructor(
    public saiyan: SuperSaiyanService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => {
      const phase = this.saiyan.phase();
      if (!this.isBrowser || phase === this.prevPhase) return;
      this.prevPhase = phase;
      this.zone.runOutsideAngular(() => this.onPhase(phase));
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.resize, { passive: true });
      document.addEventListener('visibilitychange', this.onVisibility);
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    cancelAnimationFrame(this.raf);
    this.timers.forEach(clearTimeout);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private onPhase(phase: SaiyanPhase): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];

    if (phase === 'charging') {
      this.stage.set('charging');
      this.startCanvas('gather');
    } else if (phase === 'transformed') {
      // The service swaps the theme at this exact moment; the flash hides it.
      this.burst();
    } else if (phase === 'reverting') {
      this.stage.set('revert');
      this.scouter.set('hidden');
      this.particles = [];
      this.stopCanvas();
      this.later(() => this.stage.set('idle'), SAIYAN_TIMING.revertMs + 200);
    }
  }

  private burst(): void {
    this.stage.set('burst');
    this.mode = 'ambient';
    this.spawnBurst();
    this.runScouter();
    this.later(() => this.stage.set('aura'), 900);
  }

  /* ---------------- Scouter ---------------- */

  private runScouter(): void {
    this.scouter.set('counting');
    const el = this.powerRef?.nativeElement;
    const target = 9001;
    const duration = this.reducedMotion ? 1 : 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      // Jitter while counting, like an overloaded scouter.
      const value = t < 1 ? Math.floor(eased * target + Math.random() * 180) : target;
      if (el) el.textContent = value.toLocaleString('en-US');
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        this.scouter.set('over');
        this.later(() => this.scouter.set('hidden'), 2600);
      }
    };
    requestAnimationFrame(tick);
  }

  /* ---------------- Canvas particles ---------------- */

  private startCanvas(mode: 'gather' | 'ambient'): void {
    if (this.reducedMotion) return;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    this.resize();
    this.mode = mode;
    this.particles = [];
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(this.frame);
  }

  private stopCanvas(): void {
    this.mode = 'off';
    cancelAnimationFrame(this.raf);
    this.ctx?.clearRect(0, 0, this.w, this.h);
  }

  private resize = (): void => {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    canvas.width = Math.round(this.w * this.dpr);
    canvas.height = Math.round(this.h * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  private onVisibility = (): void => {
    if (this.mode === 'off') return;
    cancelAnimationFrame(this.raf);
    if (!document.hidden) this.raf = requestAnimationFrame(this.frame);
  };

  private spawnGather(): void {
    const { x: ox, y: oy } = this.saiyan.origin();
    for (let i = 0; i < 7; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 220 + Math.random() * Math.max(this.w, this.h) * 0.55;
      const x = ox + Math.cos(angle) * dist;
      const y = oy + Math.sin(angle) * dist;
      this.particles.push({
        x, y, vx: 0, vy: 0, life: 0, max: 90,
        size: 1 + Math.random() * 2.2, hue: 42 + Math.random() * 14
      });
    }
  }

  private spawnBurst(): void {
    if (this.reducedMotion) return;
    if (!this.ctx) this.startCanvas('ambient');
    const { x: ox, y: oy } = this.saiyan.origin();
    this.particles = [];
    for (let i = 0; i < 160; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 16;
      this.particles.push({
        x: ox, y: oy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0, max: 40 + Math.random() * 30, size: 1.2 + Math.random() * 2.8, hue: 40 + Math.random() * 18
      });
    }
  }

  private spawnAmbient(): void {
    if (this.particles.length > 70 || Math.random() > 0.55) return;
    this.particles.push({
      x: Math.random() * this.w, y: this.h + 10,
      vx: (Math.random() - 0.5) * 0.4, vy: -(0.8 + Math.random() * 1.8),
      life: 0, max: 220 + Math.random() * 200, size: 0.8 + Math.random() * 2.2, hue: 38 + Math.random() * 18
    });
  }

  private frame = (): void => {
    const ctx = this.ctx;
    if (!ctx || this.mode === 'off') return;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';

    if (this.mode === 'gather') {
      this.spawnGather();
      const { x: ox, y: oy } = this.saiyan.origin();
      // Growing core of energy at the origin
      const pulse = 60 + Math.random() * 20 + Math.min(this.particles.length, 200) * 0.25;
      const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, pulse);
      g.addColorStop(0, 'rgba(255,250,210,0.9)');
      g.addColorStop(0.35, 'rgba(255,205,40,0.45)');
      g.addColorStop(1, 'rgba(255,170,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(ox, oy, pulse, 0, Math.PI * 2);
      ctx.fill();

      for (const p of this.particles) {
        const dx = ox - p.x;
        const dy = oy - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const accel = 0.9 + p.life * 0.06;
        p.vx = p.vx * 0.9 + (dx / d) * accel;
        p.vy = p.vy * 0.9 + (dy / d) * accel;
        const px = p.x;
        const py = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (d < 18) p.life = p.max;
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${65 + p.size * 8}%, 0.9)`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(px - p.vx * 2.5, py - p.vy * 2.5);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    } else {
      this.spawnAmbient();
      for (const p of this.particles) {
        p.vx *= 0.97;
        p.vy = p.vy * 0.985 + (p.vy < -1 ? 0 : -0.02);
        p.x += p.vx + Math.sin((p.life + p.hue) * 0.05) * 0.3;
        p.y += p.vy;
        p.life++;
        const fade = 1 - p.life / p.max;
        ctx.fillStyle = `hsla(${p.hue}, 100%, 62%, ${Math.max(0, fade) * 0.85})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.particles = this.particles.filter(p => p.life < p.max && p.y > -20);
    ctx.globalCompositeOperation = 'source-over';
    this.raf = requestAnimationFrame(this.frame);
  };

  private later(fn: () => void, ms: number): void {
    this.timers.push(setTimeout(fn, ms));
  }
}
