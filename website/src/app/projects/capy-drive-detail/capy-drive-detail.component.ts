import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SuperSaiyanService } from '../../services/super-saiyan.service';

@Component({
    selector: 'app-capy-drive-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './capy-drive-detail.component.html',
    styleUrl: './capy-drive-detail.component.css'
})
export class CapyDriveDetailComponent implements OnInit, AfterViewInit {
    constructor(
        private titleService: Title,
        private metaService: Meta,
        public superSaiyan: SuperSaiyanService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
        }
        this.titleService.setTitle('CapyDrive: Modernizing Theory Learning | Jimmy Nguyen');
        this.metaService.addTags([
            { name: 'description', content: 'A deep dive into CapyDrive, a modern SaaS for Dutch driving theory built with Angular 21+ and Firebase Serverless architecture in europe-west4.' },
            { name: 'keywords', content: 'CapyDrive, Angular 21, Firebase, Serverless, Mollie, Dutch Driving Theory, SaaS, Technical Write-up, Eemshaven' },
            { name: 'author', content: 'Jimmy Nguyen' },
            { property: 'og:title', content: 'CapyDrive: Modernizing Theory Learning' },
            { property: 'og:description', content: 'How I built a scalable, affordable theory platform using serverless tech and Angular 21+.' },
            { property: 'og:image', content: 'assets/logo.png' },
            { property: 'og:url', content: 'https://stukongeluk.github.io/projects/capydrive' },
            { property: 'og:type', content: 'article' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'robots', content: 'index, follow' }
        ]);
    }

    async ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            try {
                // Re-adding the import as it worked before and we have the package installed now
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'neutral',
                    securityLevel: 'loose',
                    fontFamily: 'Inter, sans-serif'
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
            description: 'GitHub Actions handles the heavy lifting—running linting, testing, and deploying to Firebase Hosting and Functions on every push.',
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
        { name: 'Angular 21+', description: 'Bleeding Edge Frontend' },
        { name: 'Firebase', description: 'Serverless Backend' },
        { name: 'TypeScript 5+', description: 'Type-Safe Everything' },
        { name: 'Mollie', description: 'Localized Payments' },
        { name: 'Node.js 20', description: 'Cloud Functions' },
        { name: 'GitHub Actions', description: 'CI/CD Pipeline' }
    ];
}
