import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SuperSaiyanService {
    // Global Super Saiyan state
    isTransformed = signal(false);
    isAnimating = signal(false);

    toggle(): void {
        if (this.isAnimating()) return; // Prevent spam clicking

        this.isAnimating.set(true);

        // Toggle the transformed state
        this.isTransformed.update(v => !v);

        // Update body class for global CSS transformations
        if (this.isTransformed()) {
            document.body.classList.add('super-saiyan-mode');
        } else {
            document.body.classList.remove('super-saiyan-mode');
        }

        // Reset animation state after animation completes
        setTimeout(() => {
            this.isAnimating.set(false);
        }, 600);
    }
}
