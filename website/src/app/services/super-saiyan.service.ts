import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SuperSaiyanService {
    // Global Super Saiyan state
    isTransformed = signal(false);
    isAnimating = signal(false);

    // Audio elements
    private transformationSound: HTMLAudioElement | null = null;
    private backgroundMusic: HTMLAudioElement | null = null;

    constructor() {
        // Initialize audio elements
        if (typeof window !== 'undefined') {
            this.transformationSound = new Audio('assets/super-sa-yan-1.wav');
            this.backgroundMusic = new Audio('assets/15. Solid State Scouter(Dynamite Battle).mp3');
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.3; // Background music at 30% volume
        }
    }

    toggle(): void {
        if (this.isAnimating()) return; // Prevent spam clicking

        this.isAnimating.set(true);

        // Toggle the transformed state
        this.isTransformed.update(v => !v);

        // Update body class for global CSS transformations
        if (this.isTransformed()) {
            document.body.classList.add('super-saiyan-mode');

            // Play transformation sound
            if (this.transformationSound) {
                this.transformationSound.currentTime = 0;
                this.transformationSound.play().catch(() => {
                    // Audio play failed (likely due to autoplay policy)
                    console.log('Transformation sound blocked by browser');
                });
            }

            // Start background music after transformation sound
            if (this.backgroundMusic) {
                // Delay background music slightly so transformation sound can be heard
                setTimeout(() => {
                    if (this.isTransformed() && this.backgroundMusic) {
                        this.backgroundMusic.currentTime = 0;
                        this.backgroundMusic.play().catch(() => {
                            console.log('Background music blocked by browser');
                        });
                    }
                }, 1000);
            }
        } else {
            document.body.classList.remove('super-saiyan-mode');

            // Fade out background music
            if (this.backgroundMusic) {
                this.fadeOutAudio(this.backgroundMusic);
            }
        }

        // Reset animation state after animation completes
        setTimeout(() => {
            this.isAnimating.set(false);
        }, 600);
    }

    private fadeOutAudio(audio: HTMLAudioElement): void {
        const fadeInterval = 50; // ms
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
        }, fadeInterval);
    }
}
