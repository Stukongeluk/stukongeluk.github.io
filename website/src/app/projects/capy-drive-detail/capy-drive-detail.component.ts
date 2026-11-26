import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { SuperSaiyanService } from '../../services/super-saiyan.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { LeafCanopyComponent } from '../../leaves/leaf-canopy.component';
import { WriteupBackdropComponent } from '../../shared/writeup-backdrop.component';

@Component({
    selector: 'app-capy-drive-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, RevealDirective, WriteupBackdropComponent, LeafCanopyComponent],
    templateUrl: './capy-drive-detail.component.html',
    styleUrl: './capy-drive-detail.component.css'
})
export class CapyDriveDetailComponent implements OnInit, AfterViewInit {
    constructor(
        private seoService: SeoService,
        public superSaiyan: SuperSaiyanService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
        }
        this.seoService.update({
            title: 'CapyDrive: Modernizing Theory Learning | Jimmy Nguyen',
            ogTitle: 'CapyDrive: Modernizing Theory Learning',
            description: 'How I built CapyDrive, a Duolingo-style app for the Dutch car and scooter theory exams, with Angular 21, serverless Firebase in europe-west4, and AI agents backed by tests.',
            ogDescription: 'Car and scooter theory, CBR-format mock exams and spaced repetition: how I built an affordable theory platform with serverless tech, Angular 21 and AI agents.',
            url: 'https://jimmynguyen.nl/projects/capydrive/',
            type: 'article',
            keywords: 'CapyDrive, Angular 21, Firebase, Serverless, Cloud Functions, Mollie, Dutch Driving Theory, CBR, Scooter AM, Spaced Repetition, AI-assisted development, Eemshaven',
            image: 'https://jimmynguyen.nl/assets/og/capydrive.jpg',
            imageWidth: 1200,
            imageHeight: 630,
            imageType: 'image/jpeg',
            imageAlt: 'CapyDrive project write-up by Jimmy Nguyen, with the CapyDrive logo'
        });
    }

    async ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            try {
                // Re-adding the import as it worked before and we have the package installed now
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'base',
                    securityLevel: 'loose',
                    fontFamily: '"Zen Kaku Gothic New", sans-serif',
                    // Japandi palette: washi paper, oak lines, ink text
                    themeVariables: {
                        fontFamily: '"Zen Kaku Gothic New", sans-serif',
                        primaryColor: '#FBF8F3',
                        primaryBorderColor: '#A67B4F',
                        primaryTextColor: '#3F2E20',
                        lineColor: '#8F826F',
                        clusterBkg: '#F5EFE6',
                        clusterBorder: '#DACDBA',
                        edgeLabelBackground: '#F5EFE6',
                        tertiaryColor: '#F5EFE6'
                    }
                });
                // Use the new mermaid.run() API or init() depending on the version
                if (mermaid.run) {
                    await mermaid.run();
                } else {
                    mermaid.init(undefined, '.mermaid');
                }
            } catch (e) {
                console.error('Error initializing mermaid from module', e);
            }
        }
    }

    challenges = [
        {
            title: 'Content Pipeline',
            description: 'Managing 1000+ questions and lessons requires structure. I built a custom admin dashboard in Angular to manage content with instant Firebase sync.',
            icon: '📝'
        },
        {
            title: 'Zero-Infrastructure Cost',
            description: 'By leveraging Firebase Cloud Functions and Firestore, the app scales from zero to thousands of users with zero fixed monthly costs.',
            icon: '💰'
        },
        {
            title: 'GDPR & EU Compliance',
            description: 'Data privacy is paramount. I implemented specific data-deletion flows and localized data storage in the europe-west4 (Eemshaven) region for low latency and strict data sovereignty.',
            icon: '🇪🇺'
        },
        {
            title: 'UX/UI for Education',
            description: 'Learning is hard, so the interface shouldn\'t be. I used modern CSS animations and glassmorphism to keep users engaged during long study sessions.',
            icon: '✨'
        },
        {
            title: 'Scalable Payments',
            description: 'Integration with Mollie API was handled via secure Node.js serverless functions, supporting iDEAL, Bancontact, and Credit Cards.',
            icon: '💼'
        },
        {
            title: 'Automated Pipelines',
            description: 'GitHub Actions handles the heavy lifting: running linting, testing, and deploying to Firebase Hosting and Functions on every push.',
            icon: '🚀'
        },
        {
            title: 'Dev vs Prod Parity',
            description: 'I use Firebase Emulators to mirror the production environment locally, ensuring that features work perfectly before being merged.',
            icon: '🧪'
        },
        {
            title: 'Gamified Growth',
            description: 'Implemented a custom leaderboard and achievement system using Firestore triggers to boost user retention and make learning addictive.',
            icon: '🎮'
        }
    ];

    techStack = [
        { name: 'Angular 21', description: 'Signals Frontend' },
        { name: 'Firebase', description: 'Serverless Backend' },
        { name: 'TypeScript', description: 'Type-Safe Everything' },
        { name: 'Node.js 22', description: 'Cloud Functions' },
        { name: 'Mollie', description: 'Localized Payments' },
        { name: 'GitHub Actions', description: 'CI/CD Pipeline' },
        { name: 'Vitest', description: 'Automated Tests' },
        { name: 'Remotion', description: '3D Videos in Code' }
    ];
}
