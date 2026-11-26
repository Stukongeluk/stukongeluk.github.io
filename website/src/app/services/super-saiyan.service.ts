import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeService } from './theme.service';

export type SaiyanPhase = 'idle' | 'charging' | 'transformed' | 'reverting';

/** Timings of the transformation, shared with the FX overlay. */
export const SAIYAN_TIMING = {
    chargeMs: 1300,
    hardChargeAtMs: 750,
    revertMs: 650,
};

@Injectable({
    providedIn: 'root'
})
export class SuperSaiyanService {
    /** True once the gold theme is applied (after the power-up burst). */
    isTransformed = signal(false);
    /** True while charging up or powering down. */
    isAnimating = signal(false);
    phase = signal<SaiyanPhase>('idle');
    /** Screen point the energy gathers into (the portrait, or the clicked button). */
    origin = signal<{ x: number; y: number }>({ x: 0, y: 0 });

    // Audio is created on the first click only, so it never costs page load.
    private transformationSound: HTMLAudioElement | null = null;
    private backgroundMusic: HTMLAudioElement | null = null;
    private readonly isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        @Inject(DOCUMENT) private document: Document,
        private theme: ThemeService
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    toggle(event?: Event): void {
        if (!this.isBrowser || this.isAnimating()) return; // Prevent spam clicking

        this.origin.set(this.resolveOrigin(event));
        this.isAnimating.set(true);

        if (!this.isTransformed()) {
            this.powerUp();
        } else {
            this.powerDown();
        }
    }

    private powerUp(): void {
        const body = this.document.body;
        this.phase.set('charging');
        body.classList.add('ss-charging');
        this.ensureAudio();

        if (this.transformationSound) {
            this.transformationSound.currentTime = 0;
            this.transformationSound.play().catch(() => { /* autoplay policy */ });
        }

        setTimeout(() => body.classList.add('ss-charging-hard'), SAIYAN_TIMING.hardChargeAtMs);

        setTimeout(() => {
            body.classList.remove('ss-charging', 'ss-charging-hard');
            // The FX overlay flashes at this exact moment, which hides the theme swap.
            body.classList.add('super-saiyan-mode');
            // Power up into Evening for drama; the toggle can still switch to Daylight.
            this.theme.apply(true, false);
            this.isTransformed.set(true);
            this.phase.set('transformed');
            this.isAnimating.set(false);

            if (this.backgroundMusic) {
                this.backgroundMusic.volume = 0.3;
                this.backgroundMusic.currentTime = 0;
                this.backgroundMusic.play().catch(() => { /* autoplay policy */ });
            }
        }, SAIYAN_TIMING.chargeMs);
    }

    private powerDown(): void {
        const body = this.document.body;
        this.phase.set('reverting');

        if (this.backgroundMusic) {
            this.fadeOutAudio(this.backgroundMusic);
        }

        setTimeout(() => {
            body.classList.remove('super-saiyan-mode');
            // Back to whatever the visitor chose themselves.
            this.theme.apply(this.theme.savedIsDark(), false);
            this.isTransformed.set(false);
        }, SAIYAN_TIMING.revertMs * 0.4);

        setTimeout(() => {
            this.phase.set('idle');
            this.isAnimating.set(false);
        }, SAIYAN_TIMING.revertMs);
    }

    private ensureAudio(): void {
        if (this.transformationSound) return;
        // Warm up the assets the transformed state needs while charging up.
        new Image().src = 'assets/super-saiyan-aura.webp';
        new Image().src = 'assets/hero_profile2.webp';
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

    private fadeOutAudio(audio: HTMLAudioElement): void {
        const fadeStep = 0.05;
        const fadeOut = setInterval(() => {
            if (audio.volume > fadeStep) {
                audio.volume -= fadeStep;
            } else {
                audio.volume = 0;
                audio.pause();
                audio.volume = 0.3; // Reset volume for next play
                clearInterval(fadeOut);
            }
        }, 50);
    }
}
