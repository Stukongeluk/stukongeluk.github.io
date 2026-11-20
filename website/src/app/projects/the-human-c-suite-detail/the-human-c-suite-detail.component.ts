import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-the-human-c-suite-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './the-human-c-suite-detail.component.html',
    styleUrl: './the-human-c-suite-detail.component.css'
})
export class TheHumanCSuiteDetailComponent implements OnInit {
    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId) && !window.location.hash) {
            window.scrollTo(0, 0);
        }
        const description = 'Open-source agent skills that make an AI agent think like a humane CEO, CTO and CPTO: grounded in company data, layoffs as the last resort, AI measured before anyone banks on it, and pushback welcome.';
        this.titleService.setTitle('The Human C-Suite: AI agent skills for running a company without losing your humanity | Jimmy Nguyen');
        this.metaService.updateTag({ name: 'description', content: description });
        this.metaService.updateTag({ name: 'keywords', content: 'The Human C-Suite, agent skills, Claude, AI agents, MCP, leadership, layoffs, reskilling, IKEA, AI adoption, CTO, CPTO, CEO, good leadership, works council, Nordic model' });
        this.metaService.updateTag({ name: 'author', content: 'Jimmy Nguyen' });
        this.metaService.updateTag({ property: 'og:title', content: 'The Human C-Suite: AI agent skills for running a company without losing your humanity' });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:image', content: 'https://jimmynguyen.nl/assets/the-human-c-suite.jpg' });
        this.metaService.updateTag({ property: 'og:url', content: 'https://jimmynguyen.nl/projects/the-human-c-suite' });
        this.metaService.updateTag({ property: 'og:type', content: 'article' });
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    }

    techStack = [
        { name: 'Agent Skills' },
        { name: 'Claude Code plugin' },
        { name: 'MCP data sources' },
        { name: 'skill-creator evals' },
        { name: 'Open source (MIT)' }
    ];

    seats = [
        { name: 'the-human-ceo', description: 'cost cuts, reorgs, AI rollouts, board papers' },
        { name: 'the-human-cto', description: 'AI coding tools, platforms, tech debt, engineering metrics' },
        { name: 'the-human-cpto', description: 'roadmaps, sales promises, the AI story for the board' }
    ];
}
