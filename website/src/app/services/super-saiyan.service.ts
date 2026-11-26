import { Injectable, signal, computed, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeService } from './theme.service';

export type SaiyanPhase = 'idle' | 'charging' | 'transformed' | 'reverting';
export type SaiyanForm = 'base' | 'ssj1' | 'ssj2' | 'ssj3' | 'ssg' | 'ssb' | 'ui_sign' | 'mui';
export type TransformedSaiyanForm = Exclude<SaiyanForm, 'base'>;

export interface SaiyanFormInfo {
    id: SaiyanForm;
    level: number;
    name: string;
    shortName: string;
    kanji: string;
    nextActionLabel: string;
    buttonLabel: string;
    csuiteTitle: string;
    csuiteSubtitle: string;
    scouterLabel: string;
    scouterTarget: number;
    scouterInfinite?: boolean;
    scouterOver: string;
    bodyClass: string | null;
    playbackRate: number;
}

export const SAIYAN_FORMS: readonly SaiyanForm[] = ['base', 'ssj1', 'ssj2', 'ssj3', 'ssg', 'ssb', 'ui_sign', 'mui'];
export const SAIYAN_TRANSFORMED_FORMS: readonly TransformedSaiyanForm[] = ['ssj1', 'ssj2', 'ssj3', 'ssg', 'ssb', 'ui_sign', 'mui'];

export const SAIYAN_FORM_INFO: Record<SaiyanForm, SaiyanFormInfo> = {
    base: {
        id: 'base',
        level: 0,
        name: 'Base',
        shortName: 'Base',
        kanji: '静かな力',
        nextActionLabel: 'Power up: turn on Super Saiyan mode',
        buttonLabel: 'ASCEND',
        csuiteTitle: 'Human',
        csuiteSubtitle: '',
        scouterLabel: 'Power level',
        scouterTarget: 0,
        scouterOver: '',
        bodyClass: null,
        playbackRate: 1.0
    },
    ssj1: {
        id: 'ssj1',
        level: 1,
        name: 'Super Saiyan',
        shortName: 'SSJ',
        kanji: '超サイヤ人',
        nextActionLabel: 'Go further beyond: transform into Super Saiyan 2',
        buttonLabel: 'FURTHER BEYOND',
        csuiteTitle: 'SUPER HUMAN',
        csuiteSubtitle: 'Empathy is the real superpower of leadership.',
        scouterLabel: 'Super Saiyan',
        scouterTarget: 9001,
        scouterOver: "It's over 9000!",
        bodyClass: 'ssj-1',
        playbackRate: 1.0
    },
    ssj2: {
        id: 'ssj2',
        level: 2,
        name: 'Super Saiyan 2',
        shortName: 'SSJ2',
        kanji: '超サイヤ人二',
        nextActionLabel: 'Go even further beyond: transform into Super Saiyan 3',
        buttonLabel: 'FURTHER BEYOND',
        csuiteTitle: 'SUPER HUMAN 2',
        csuiteSubtitle: 'High-voltage empathy. Zero layoffs, maximum voltage.',
        scouterLabel: 'Super Saiyan 2',
        scouterTarget: 180000,
        scouterOver: 'High voltage!',
        bodyClass: 'ssj-2',
        playbackRate: 1.08
    },
    ssj3: {
        id: 'ssj3',
        level: 3,
        name: 'Super Saiyan 3',
        shortName: 'SSJ3',
        kanji: '超サイヤ人三',
        nextActionLabel: 'Unlock God Ki: transform into Super Saiyan God',
        buttonLabel: 'EVEN FURTHER',
        csuiteTitle: 'SUPER HUMAN 3',
        csuiteSubtitle: 'Going even further beyond — leadership that actually scales.',
        scouterLabel: 'Super Saiyan 3',
        scouterTarget: 720000,
        scouterOver: 'Even further beyond!',
        bodyClass: 'ssj-3',
        playbackRate: 0.9
    },
    ssg: {
        id: 'ssg',
        level: 4,
        name: 'Super Saiyan God',
        shortName: 'SSG',
        kanji: '超サイヤ人神',
        nextActionLabel: 'Combine God Ki with Super Saiyan: transform into Super Saiyan Blue',
        buttonLabel: 'FURTHER BEYOND',
        csuiteTitle: 'DIVINE HUMAN',
        csuiteSubtitle: 'Calm, focused, godly leadership. Empathy at divine scale.',
        scouterLabel: 'Super Saiyan God',
        scouterTarget: 999999,
        scouterInfinite: true,
        scouterOver: 'God Ki · Unreadable!',
        bodyClass: 'ssj-god',
        playbackRate: 1.14
    },
    ssb: {
        id: 'ssb',
        level: 5,
        name: 'Super Saiyan Blue',
        shortName: 'SSB',
        kanji: '超サイヤ人青',
        nextActionLabel: 'Break your shell: awaken Ultra Instinct Sign',
        buttonLabel: 'BREAK LIMITS',
        csuiteTitle: 'TRANSCENDENT',
        csuiteSubtitle: 'Complete ki control. Calm precision under impossible pressure.',
        scouterLabel: 'Super Saiyan Blue',
        scouterTarget: 999999,
        scouterInfinite: true,
        scouterOver: 'God Ki · Perfected',
        bodyClass: 'ssj-blue',
        playbackRate: 1.2
    },
    ui_sign: {
        id: 'ui_sign',
        level: 6,
        name: 'Ultra Instinct Sign',
        shortName: 'UI Sign',
        kanji: '身勝手の極意兆',
        nextActionLabel: 'Master Ultra Instinct',
        buttonLabel: 'AWAKEN',
        csuiteTitle: 'INSTINCTIVE',
        csuiteSubtitle: 'Moving without hesitation. Clarity beyond noise.',
        scouterLabel: 'Ultra Instinct Sign',
        scouterTarget: 999999,
        scouterInfinite: true,
        scouterOver: 'Autonomous Instinct',
        bodyClass: 'ssj-ui-sign',
        playbackRate: 0.96
    },
    mui: {
        id: 'mui',
        level: 7,
        name: 'Ultra Instinct',
        shortName: 'UI',
        kanji: '身勝手の極意',
        nextActionLabel: 'Power down from Ultra Instinct to Base',
        buttonLabel: 'MASTERED',
        csuiteTitle: 'MASTERED HUMAN',
        csuiteSubtitle: 'Effortless clarity. Quiet strength perfected.',
        scouterLabel: 'Ultra Instinct',
        scouterTarget: 999999,
        scouterInfinite: true,
        scouterOver: 'Mastered · Beyond Limits',
        bodyClass: 'ssj-mui',
        playbackRate: 1.04
    }
};

const ALL_FORM_CLASSES = [
    'super-saiyan-mode',
    'ssj-1', 'ssj-2', 'ssj-3', 'ssj-god', 'ssj-blue', 'ssj-ui-sign', 'ssj-mui'
];
const CHARGING_CLASSES = [
    'ss-charging', 'ss-charging-hard',
    'ss-charging-ssj2', 'ss-charging-ssj3', 'ss-charging-ssg',
    'ss-charging-ssb', 'ss-charging-ui_sign', 'ss-charging-mui'
];

/** Timings of the transformation, shared with the FX overlay. */
export const SAIYAN_TIMING = {
    chargeMs: 1300,
    ascendChargeMs: 850,
    hardChargeAtMs: 750,
    ascendHardChargeAtMs: 420,
    revertMs: 650,
};

@Injectable({
    providedIn: 'root'
})
export class SuperSaiyanService implements OnDestroy {
    readonly forms = SAIYAN_TRANSFORMED_FORMS;
    readonly formInfoMap = SAIYAN_FORM_INFO;

    /** Active transformation stage. */
    form = signal<SaiyanForm>('base');
    /** Stage currently being charged into (drives FX color before the burst swaps the theme). */
    targetForm = signal<SaiyanForm>('base');
    /** True once any transformed theme is applied. */
    isTransformed = computed(() => this.form() !== 'base');
    isMaxForm = computed(() => this.form() === 'mui');
    currentFormInfo = computed(() => SAIYAN_FORM_INFO[this.form()]);
    targetFormInfo = computed(() => SAIYAN_FORM_INFO[this.targetForm()]);

    /** True while charging up or powering down. */
    isAnimating = signal(false);
    phase = signal<SaiyanPhase>('idle');
    /** Increments on each transformation burst so the FX overlay replays for every stage. */
    burstTick = signal(0);
    /** Screen point the energy gathers into (the portrait, or the clicked button). */
    origin = signal<{ x: number; y: number }>({ x: 0, y: 0 });

    // Audio is created on the first click only, so it never costs page load.
    private transformationSound: HTMLAudioElement | null = null;
    private backgroundMusic: HTMLAudioElement | null = null;
    private fadeIntervalId: ReturnType<typeof setInterval> | null = null;
    private timers: ReturnType<typeof setTimeout>[] = [];
    private readonly isBrowser: boolean;

    private readonly onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.isTransformed() && !this.isAnimating()) {
            this.powerDown();
        }
    };

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(DOCUMENT) private document: Document,
        private theme: ThemeService
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.document.defaultView?.addEventListener('keydown', this.onKeyDown);
        }
    }

    ngOnDestroy(): void {
        if (this.isBrowser) {
            this.document.defaultView?.removeEventListener('keydown', this.onKeyDown);
        }
        this.clearTimers();
        this.cancelFadeOut();
    }

    /** Cycles Base -> SSJ -> SSJ2 -> SSJ3 -> SSG -> SSB -> UI Sign -> UI -> Base. */
    toggle(event?: Event): void {
        this.advance(event);
    }

    /** Advances one transformation level, or returns to Base from Mastered UI. */
    advance(event?: Event): void {
        if (!this.isBrowser || this.isAnimating()) return;
        const currentIndex = SAIYAN_FORMS.indexOf(this.form());
        const nextForm = SAIYAN_FORMS[(currentIndex + 1) % SAIYAN_FORMS.length];
        this.setForm(nextForm, event);
    }

    /** Instantly powers down to Base from any stage. */
    powerDown(event?: Event): void {
        if (!this.isBrowser || this.isAnimating() || this.form() === 'base') return;
        this.origin.set(this.resolveOrigin(event));
        this.isAnimating.set(true);
        this.runPowerDown();
    }

    /** Transitions directly to any specific stage. */
    setForm(target: SaiyanForm, event?: Event): void {
        if (!this.isBrowser || this.isAnimating() || this.form() === target) return;

        this.origin.set(this.resolveOrigin(event));
        this.isAnimating.set(true);

        if (target === 'base') {
            this.runPowerDown();
        } else {
            this.runPowerUp(target);
        }
    }

    private runPowerUp(target: TransformedSaiyanForm): void {
        const body = this.document.body;
        const fromBase = this.form() === 'base';
        const chargeMs = fromBase ? SAIYAN_TIMING.chargeMs : SAIYAN_TIMING.ascendChargeMs;
        const hardAtMs = fromBase ? SAIYAN_TIMING.hardChargeAtMs : SAIYAN_TIMING.ascendHardChargeAtMs;

        this.clearTimers();
        this.cancelFadeOut();
        this.targetForm.set(target);
        this.phase.set('charging');
        body.classList.remove(...CHARGING_CLASSES);
        body.classList.add('ss-charging');
        if (target !== 'ssj1') {
            body.classList.add(`ss-charging-${target}`);
        }
        this.ensureAudio();

        if (this.transformationSound) {
            this.transformationSound.playbackRate = SAIYAN_FORM_INFO[target].playbackRate;
            this.transformationSound.currentTime = 0;
            this.transformationSound.play().catch(() => { /* autoplay policy */ });
        }

        this.timers.push(setTimeout(() => body.classList.add('ss-charging-hard'), hardAtMs));

        this.timers.push(setTimeout(() => {
            body.classList.remove(...CHARGING_CLASSES, ...ALL_FORM_CLASSES);
            const info = SAIYAN_FORM_INFO[target];
            // The FX overlay flashes at this exact moment, hiding the theme swap.
            body.classList.add('super-saiyan-mode');
            if (info.bodyClass) {
                body.classList.add(info.bodyClass);
            }
            // Power up into Evening from base for drama; respect user toggle if already transformed.
            if (fromBase) {
                this.theme.apply(true, false);
            }
            this.form.set(target);
            this.phase.set('transformed');
            this.burstTick.update(n => n + 1);
            this.isAnimating.set(false);

            if (this.backgroundMusic && this.backgroundMusic.paused) {
                this.backgroundMusic.volume = 0.3;
                this.backgroundMusic.currentTime = 0;
                this.backgroundMusic.play().catch(() => { /* autoplay policy */ });
            }
        }, chargeMs));
    }

    private runPowerDown(): void {
        const body = this.document.body;
        this.clearTimers();
        this.targetForm.set('base');
        this.phase.set('reverting');
        body.classList.remove(...CHARGING_CLASSES);

        if (this.backgroundMusic && !this.backgroundMusic.paused) {
            this.fadeOutAudio(this.backgroundMusic);
        }

        this.timers.push(setTimeout(() => {
            body.classList.remove(...ALL_FORM_CLASSES);
            // Back to whatever the visitor chose themselves.
            this.theme.apply(this.theme.savedIsDark(), false);
            this.form.set('base');
        }, SAIYAN_TIMING.revertMs * 0.4));

        this.timers.push(setTimeout(() => {
            this.phase.set('idle');
            this.isAnimating.set(false);
        }, SAIYAN_TIMING.revertMs));
    }

    private ensureAudio(): void {
        if (this.transformationSound) return;
        // Warm up the assets the transformed states need while charging up.
        for (const src of [
            'assets/super-saiyan-aura.webp',
            'assets/hero_profile2.webp',
            'assets/hero_profile_ssj2.webp',
            'assets/hero_profile_ssj3.webp',
            'assets/hero_profile_ssg.webp',
            'assets/hero_profile_ssb.webp',
            'assets/hero_profile_ui_sign.webp',
            'assets/hero_profile_mui.webp'
        ]) {
            new Image().src = src;
        }
        this.transformationSound = new Audio('assets/super-sa-yan-1.wav');
        this.backgroundMusic = new Audio('assets/15. Solid State Scouter(Dynamite Battle).mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.preload = 'auto';
    }

    private resolveOrigin(event?: Event): { x: number; y: number } {
        const view = this.document.defaultView!;
        const target = (event?.currentTarget ?? event?.target) as Element | null;
        if (target && 'getBoundingClientRect' in target) {
            const r = target.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
        return { x: view.innerWidth / 2, y: view.innerHeight / 2 };
    }

    private cancelFadeOut(): void {
        if (this.fadeIntervalId) {
            clearInterval(this.fadeIntervalId);
            this.fadeIntervalId = null;
        }
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;
        }
    }

    private fadeOutAudio(audio: HTMLAudioElement): void {
        this.cancelFadeOut();
        const fadeStep = 0.05;
        this.fadeIntervalId = setInterval(() => {
            if (audio.volume > fadeStep) {
                audio.volume = Math.max(0, audio.volume - fadeStep);
            } else {
                audio.volume = 0;
                audio.pause();
                audio.volume = 0.3;
                this.cancelFadeOut();
            }
        }, 50);
    }

    private clearTimers(): void {
        this.timers.forEach(clearTimeout);
        this.timers = [];
    }
}
