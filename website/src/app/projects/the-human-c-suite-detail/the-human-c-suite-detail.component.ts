import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { SuperSaiyanService } from '../../services/super-saiyan.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { LeafCanopyComponent } from '../../leaves/leaf-canopy.component';
import { WriteupBackdropComponent } from '../../shared/writeup-backdrop.component';

@Component({
    selector: 'app-the-human-c-suite-detail',
    standalone: true,
    imports: [RouterModule, NgClass, RevealDirective, WriteupBackdropComponent, LeafCanopyComponent],
    templateUrl: './the-human-c-suite-detail.component.html',
    styleUrl: './the-human-c-suite-detail.component.css'
})
export class TheHumanCSuiteDetailComponent implements OnInit {
    constructor(
        private seoService: SeoService,
        public superSaiyan: SuperSaiyanService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId) && !window.location.hash) {
            window.scrollTo(0, 0);
        }

        const pageUrl = 'https://jimmynguyen.nl/projects/the-human-c-suite/';
        const imageUrl = 'https://jimmynguyen.nl/assets/og/the-human-c-suite.jpg';
        const description = 'Open-source AI agent skills for Claude and Gemini: a humane CEO, CFO, CTO, CPTO & CHRO grounded in company data, with layoffs as a last resort and blind evals.';

        this.seoService.update({
            title: 'The Human C-Suite: AI Agent Skills for Leadership | Jimmy Nguyen',
            ogTitle: 'The Human C-Suite: AI Agent Skills for Humane Leadership',
            description,
            url: pageUrl,
            type: 'article',
            keywords: 'The Human C-Suite, AI agent skills, Claude Code plugin, Claude skills, Gemini agent skills, Model Context Protocol, MCP, humane leadership, AI layoffs alternative, CEO AI agent, CFO AI agent, CTO AI agent, CPTO AI agent, CHRO AI agent, HR AI agent, reskilling, works council, Nordic model, open source',
            image: imageUrl,
            imageWidth: 1200,
            imageHeight: 630,
            imageType: 'image/jpeg',
            imageAlt: 'The Human C-Suite write-up by Jimmy Nguyen, with the five C-suite agent characters',
            publishedTime: '2026-11-20T00:00:00Z',
            modifiedTime: '2026-11-21T00:00:00Z',
            section: 'AI Agents & Leadership',
            tags: ['The Human C-Suite', 'AI Agent Skills', 'Claude Code', 'Gemini', 'MCP', 'Humane Leadership', 'Open Source'],
            jsonLd: {
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'Person',
                        '@id': 'https://jimmynguyen.nl/#person',
                        name: 'Jimmy Nguyen',
                        url: 'https://jimmynguyen.nl/',
                        jobTitle: 'Senior DevOps Engineer & Full-Stack Developer',
                        sameAs: [
                            'https://github.com/Stukongeluk',
                            'https://www.linkedin.com/in/jimmy-nguyen-software-engineer/'
                        ]
                    },
                    {
                        '@type': 'WebSite',
                        '@id': 'https://jimmynguyen.nl/#website',
                        url: 'https://jimmynguyen.nl/',
                        name: 'Jimmy Nguyen',
                        publisher: { '@id': 'https://jimmynguyen.nl/#person' }
                    },
                    {
                        '@type': 'BreadcrumbList',
                        '@id': `${pageUrl}#breadcrumb`,
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Home',
                                item: 'https://jimmynguyen.nl/'
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Projects',
                                item: 'https://jimmynguyen.nl/#projects'
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: 'The Human C-Suite',
                                item: pageUrl
                            }
                        ]
                    },
                    {
                        '@type': 'SoftwareSourceCode',
                        '@id': `${pageUrl}#software`,
                        name: 'The Human C-Suite',
                        description: 'Free, open-source Agent Skills (the-human-ceo, the-human-cfo, the-human-cto, the-human-cpto, and the-human-chro) for Claude Code, Claude apps, and Gemini that ground executive decisions in real company data via MCP and treat layoffs as the last resort.',
                        codeRepository: 'https://github.com/Stukongeluk/the-human-c-suite',
                        url: pageUrl,
                        license: 'https://opensource.org/licenses/MIT',
                        runtimePlatform: ['Claude Code', 'Claude', 'Gemini', 'Google Antigravity', 'Agent Skills'],
                        author: { '@id': 'https://jimmynguyen.nl/#person' }
                    },
                    {
                        '@type': 'TechArticle',
                        '@id': `${pageUrl}#article`,
                        headline: 'The Human C-Suite: AI agent skills for running a company without losing your humanity',
                        alternativeHeadline: 'Open-source CEO, CFO, CTO, CPTO, and CHRO agent skills for Claude and Gemini',
                        description,
                        url: pageUrl,
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': pageUrl
                        },
                        image: {
                            '@type': 'ImageObject',
                            url: imageUrl,
                            width: 1200,
                            height: 630
                        },
                        datePublished: '2026-11-20T00:00:00Z',
                        dateModified: '2026-11-24T00:00:00Z',
                        inLanguage: 'en',
                        author: { '@id': 'https://jimmynguyen.nl/#person' },
                        publisher: { '@id': 'https://jimmynguyen.nl/#person' },
                        isPartOf: { '@id': 'https://jimmynguyen.nl/#website' },
                        about: { '@id': `${pageUrl}#software` },
                        keywords: [
                            'The Human C-Suite',
                            'AI agent skills',
                            'Claude Code plugin',
                            'Model Context Protocol',
                            'MCP',
                            'humane leadership',
                            'AI layoffs',
                            'reskilling',
                            'works council',
                            'CHRO AI agent',
                            'fair performance reviews',
                            'open source'
                        ],
                        video: [
                            { '@id': `${pageUrl}#video-agents` },
                            { '@id': `${pageUrl}#video-why` },
                            { '@id': `${pageUrl}#video-seats` },
                            { '@id': `${pageUrl}#video-results` }
                        ]
                    },
                    {
                        '@type': 'VideoObject',
                        '@id': `${pageUrl}#video-agents`,
                        name: 'The Human C-Suite agents debate a 20% AI job-cut memo',
                        description: 'The CEO, CFO, CTO, CPTO and CHRO AI agent seats receive a "use AI, cut 20% of jobs" memo, push back on each other, and land on a plan with no layoffs.',
                        thumbnailUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-agents-poster.jpg',
                        contentUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-agents.mp4',
                        embedUrl: pageUrl,
                        uploadDate: '2026-11-24T00:00:00Z',
                        duration: 'PT54S',
                        encodingFormat: 'video/mp4'
                    },
                    {
                        '@type': 'VideoObject',
                        '@id': `${pageUrl}#video-why`,
                        name: 'Why humane leadership matters: the real cost of layoffs',
                        description: 'What a layoff really costs beyond severance, and how IKEA, Barry-Wehmiller and Nintendo kept their people.',
                        thumbnailUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-why-poster.jpg',
                        contentUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-why.mp4',
                        embedUrl: `${pageUrl}#why-it-matters`,
                        uploadDate: '2026-11-24T00:00:00Z',
                        duration: 'PT33S',
                        encodingFormat: 'video/mp4'
                    },
                    {
                        '@type': 'VideoObject',
                        '@id': `${pageUrl}#video-seats`,
                        name: 'How The Human C-Suite agent seats think',
                        description: 'The cost ladder, real data via MCP, reasons not rank, no surprises, and lessons borrowed from Europe and the Nordics.',
                        thumbnailUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-seats-poster.jpg',
                        contentUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-seats.mp4',
                        embedUrl: `${pageUrl}#how-the-seats-think`,
                        uploadDate: '2026-11-24T00:00:00Z',
                        duration: 'PT34S',
                        encodingFormat: 'video/mp4'
                    },
                    {
                        '@type': 'VideoObject',
                        '@id': `${pageUrl}#video-results`,
                        name: 'The Human C-Suite blind evaluation results on Claude and Gemini',
                        description: 'Blind test results with and without the skills across Claude Opus, Claude Sonnet, and Gemini, the CFO and CHRO seat benchmarks, and honest limits.',
                        thumbnailUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-results-poster.jpg',
                        contentUrl: 'https://jimmynguyen.nl/assets/the-human-c-suite-results.mp4',
                        embedUrl: `${pageUrl}#does-it-work`,
                        uploadDate: '2026-11-24T00:00:00Z',
                        duration: 'PT44S',
                        encodingFormat: 'video/mp4'
                    }
                ]
            }
        });
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
        { name: 'the-human-cfo', description: 'budgets, savings cases, cash and covenants, buybacks, bonus plans' },
        { name: 'the-human-cto', description: 'AI coding tools, platforms, tech debt, engineering metrics' },
        { name: 'the-human-cpto', description: 'roadmaps, sales promises, the AI story for the board' },
        { name: 'the-human-chro', description: 'reviews, layoff selection, return to office, pay gaps, AI in hiring' }
    ];

    relatedProjects = [
        {
            title: 'CapyDrive (EdTech SaaS)',
            route: '/projects/capydrive',
            summary: 'Serverless Angular 21 + Firebase theory exam platform'
        },
        {
            title: 'Hermes Agent on Synology NAS',
            route: '/projects/hermes-synology',
            summary: '24/7 autonomous Docker AI agent with Discord dispatch'
        }
    ];
}
