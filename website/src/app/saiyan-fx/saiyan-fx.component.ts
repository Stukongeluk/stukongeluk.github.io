import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID,
  ViewChild, effect, signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SAIYAN_FORM_INFO, SAIYAN_TIMING, SaiyanForm, SaiyanPhase, SuperSaiyanService } from '../services/super-saiyan.service';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; hue: number; sat: number; lightOffset: number;
}

/**
 * Full-screen overlay for all transformation stages: energy gathering into the
 * click origin, form-colored screen flash + shockwave, overloaded scouter, and
 * rising ki particles (gold, cyan bio-sparks, crimson embers, blue divine ki,
 * silver-blue UI heat, and pure celestial starlight).
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

  stage = signal<'idle' | 'charging' | 'burst' | 'aura' | 'revert'>('idle');
  scouter = signal<'hidden' | 'counting' | 'over'>('hidden');
  scouterLabel = signal('Power level');
  scouterOverText = signal("It's over 9000!");
  fxForm = signal<SaiyanForm>('ssj1');

  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private raf = 0;
  private scouterRaf = 0;
  private mode: 'off' | 'gather' | 'ambient' = 'off';
  private dpr = 1;
  private w = 0;
  private h = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private readonly isBrowser: boolean;
  private reducedMotion = false;
  private prevPhase: SaiyanPhase = 'idle';
  private prevBurstTick = 0;

  constructor(
    public saiyan: SuperSaiyanService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => {
      const phase = this.saiyan.phase();
      const target = this.saiyan.targetForm();
      const burstTick = this.saiyan.burstTick();
      if (!this.isBrowser) return;

      if (phase === 'charging' && this.prevPhase !== 'charging') {
        this.prevPhase = phase;
        this.fxForm.set(target === 'base' ? 'ssj1' : target);
        this.zone.runOutsideAngular(() => this.onPhase('charging', target));
      } else if (phase === 'transformed' && burstTick !== this.prevBurstTick) {
        this.prevPhase = phase;
        this.prevBurstTick = burstTick;
        const activeForm = this.saiyan.form();
        this.fxForm.set(activeForm);
        this.zone.runOutsideAngular(() => this.onPhase('transformed', activeForm));
      } else if (phase === 'reverting' && this.prevPhase !== 'reverting') {
        this.prevPhase = phase;
        this.zone.runOutsideAngular(() => this.onPhase('reverting', 'base'));
      } else if (phase === 'idle') {
        this.prevPhase = phase;
      }
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
    cancelAnimationFrame(this.scouterRaf);
    this.timers.forEach(clearTimeout);
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private onPhase(phase: SaiyanPhase, form: SaiyanForm): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    cancelAnimationFrame(this.scouterRaf);

    if (phase === 'charging') {
      this.stage.set('charging');
      this.scouter.set('hidden');
      this.startCanvas('gather');
    } else if (phase === 'transformed') {
      this.burst(form);
    } else if (phase === 'reverting') {
      this.stage.set('revert');
      this.scouter.set('hidden');
      this.particles = [];
      this.stopCanvas();
      this.later(() => this.stage.set('idle'), SAIYAN_TIMING.revertMs + 200);
    }
  }

  private burst(form: SaiyanForm): void {
    this.stage.set('burst');
    this.mode = 'ambient';
    this.spawnBurst(form);
    this.runScouter(form);
    this.later(() => this.stage.set('aura'), 900);
  }

  /* ---------------- Scouter ---------------- */

  private runScouter(form: SaiyanForm): void {
    const info = SAIYAN_FORM_INFO[form];
    this.scouterLabel.set(info.scouterLabel);
    this.scouterOverText.set(info.scouterOver);
    this.scouter.set('counting');
    const el = this.powerRef?.nativeElement;
    const target = info.scouterTarget || 9001;
    const duration = this.reducedMotion ? 1 : 1250;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const jitter = Math.max(180, target * 0.025);
      const value = t < 1 ? Math.floor(eased * target + Math.random() * jitter) : target;
      if (el) {
        el.textContent = (t >= 1 && info.scouterInfinite) ? '∞' : value.toLocaleString('en-US');
      }
      if (t < 1) {
        this.scouterRaf = requestAnimationFrame(tick);
      } else {
        this.scouter.set('over');
        this.later(() => this.scouter.set('hidden'), 2400);
      }
    };
    this.scouterRaf = requestAnimationFrame(tick);
  }

  /* ---------------- Canvas particles ---------------- */

  private pickColor(form: SaiyanForm): { hue: number; sat: number; lightOffset: number } {
    switch (form) {
      case 'ssg':
        return {
          hue: Math.random() < 0.74 ? 348 + Math.random() * 18 : 12 + Math.random() * 20,
          sat: 96,
          lightOffset: 0
        };
      case 'ssb':
        return {
          hue: Math.random() < 0.72 ? 188 + Math.random() * 18 : 206 + Math.random() * 16,
          sat: 95,
          lightOffset: 4
        };
      case 'ui_sign':
        return Math.random() < 0.55
          ? { hue: 214 + Math.random() * 16, sat: 45, lightOffset: 16 }
          : { hue: 226 + Math.random() * 22, sat: 72, lightOffset: 10 };
      case 'mui':
        return Math.random() < 0.65
          ? { hue: 215 + Math.random() * 20, sat: 18, lightOffset: 24 }
          : { hue: 252 + Math.random() * 22, sat: 48, lightOffset: 18 };
      case 'ssj2':
        return Math.random() < 0.34
          ? { hue: 194 + Math.random() * 14, sat: 100, lightOffset: 4 }
          : { hue: 40 + Math.random() * 16, sat: 100, lightOffset: 0 };
      case 'ssj3':
        return Math.random() < 0.44
          ? { hue: 192 + Math.random() * 18, sat: 100, lightOffset: 5 }
          : { hue: 42 + Math.random() * 16, sat: 100, lightOffset: 2 };
      default:
        return { hue: 38 + Math.random() * 18, sat: 100, lightOffset: 0 };
    }
  }

  private coreGradientColors(form: SaiyanForm): [string, string, string] {
    switch (form) {
      case 'ssg': return ['rgba(255,235,238,0.92)', 'rgba(244,63,94,0.52)', 'rgba(220,38,38,0)'];
      case 'ssb': return ['rgba(224,249,255,0.94)', 'rgba(34,211,238,0.52)', 'rgba(2,132,199,0)'];
      case 'ui_sign': return ['rgba(241,245,249,0.92)', 'rgba(147,197,253,0.45)', 'rgba(99,102,241,0)'];
      case 'mui': return ['rgba(255,255,255,0.96)', 'rgba(226,232,240,0.55)', 'rgba(196,181,253,0)'];
      case 'ssj2':
      case 'ssj3': return ['rgba(255,250,210,0.9)', 'rgba(56,189,248,0.45)', 'rgba(255,170,0,0)'];
      default: return ['rgba(255,250,210,0.9)', 'rgba(255,205,40,0.45)', 'rgba(255,170,0,0)'];
    }
  }

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
    const form = this.fxForm();
    const count = form === 'ssj3' || form === 'mui' ? 10 : 7;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 220 + Math.random() * Math.max(this.w, this.h) * 0.55;
      const x = ox + Math.cos(angle) * dist;
      const y = oy + Math.sin(angle) * dist;
      const c = this.pickColor(form);
      this.particles.push({
        x, y, vx: 0, vy: 0, life: 0, max: 90,
        size: 1 + Math.random() * 2.4, ...c
      });
    }
  }

  private spawnBurst(form: SaiyanForm): void {
    if (this.reducedMotion) return;
    if (!this.ctx) this.startCanvas('ambient');
    const { x: ox, y: oy } = this.saiyan.origin();
    this.particles = [];
    const total = form === 'ssj3' || form === 'mui' ? 210 : 175;
    for (let i = 0; i < total; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * (form === 'ssj3' ? 20 : 16);
      const c = this.pickColor(form);
      this.particles.push({
        x: ox, y: oy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0, max: 40 + Math.random() * 32, size: 1.2 + Math.random() * 2.8, ...c
      });
    }
  }

  private spawnAmbient(): void {
    const form = this.fxForm();
    const cap = form === 'ssj3' || form === 'mui' ? 92 : 70;
    if (this.particles.length > cap || Math.random() > 0.55) return;
    const c = this.pickColor(form);
    const slow = form === 'ui_sign' || form === 'mui';
    this.particles.push({
      x: Math.random() * this.w, y: this.h + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(slow ? 0.55 + Math.random() * 1.15 : 0.85 + Math.random() * (form === 'ssj3' ? 2.4 : 1.8)),
      life: 0, max: 220 + Math.random() * 220, size: 0.8 + Math.random() * 2.3, ...c
    });
  }

  private frame = (): void => {
    const ctx = this.ctx;
    if (!ctx || this.mode === 'off') return;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';
    const form = this.fxForm();

    if (this.mode === 'gather') {
      this.spawnGather();
      const { x: ox, y: oy } = this.saiyan.origin();
      const pulse = 60 + Math.random() * 22 + Math.min(this.particles.length, 200) * 0.25;
      const [c0, c1, c2] = this.coreGradientColors(form);
      const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, pulse);
      g.addColorStop(0, c0);
      g.addColorStop(0.35, c1);
      g.addColorStop(1, c2);
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
        const l = Math.min(95, 64 + p.size * 7 + p.lightOffset);
        ctx.strokeStyle = `hsla(${p.hue % 360}, ${p.sat}%, ${l}%, 0.9)`;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(px - p.vx * 2.5, py - p.vy * 2.5);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    } else {
      const daylight = !document.documentElement.classList.contains('dark');
      if (daylight) ctx.globalCompositeOperation = 'source-over';
      this.spawnAmbient();
      for (const p of this.particles) {
        p.vx *= 0.97;
        p.vy = p.vy * 0.985 + (p.vy < -1 ? 0 : -0.02);
        p.x += p.vx + Math.sin((p.life + p.hue) * 0.05) * 0.3;
        p.y += p.vy;
        p.life++;
        const fade = 1 - p.life / p.max;
        const baseL = daylight ? 45 : 62 + p.lightOffset;
        ctx.fillStyle = `hsla(${p.hue % 360}, ${p.sat}%, ${Math.min(96, baseL)}%, ${Math.max(0, fade) * 0.85})`;
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
