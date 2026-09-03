import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SuperSaiyanService } from '../../services/super-saiyan.service';

@Component({
    selector: 'app-hermes-synology-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './hermes-synology-detail.component.html',
    styleUrl: './hermes-synology-detail.component.css'
})
export class HermesSynologyDetailComponent implements OnInit, AfterViewInit {
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
        this.titleService.setTitle('Autonomous Ops: Hermes Agent on Synology NAS | Jimmy Nguyen');
        this.metaService.addTags([
            { name: 'description', content: 'How I built a 24/7 autonomous bot on Synology NAS with Docker, Hermes Agent, and Discord to power daily freelance contract radar and automated CBR exam question generation for CapyDrive.' },
            { name: 'keywords', content: 'Hermes Agent, NousResearch, Synology NAS, Docker, Discord Bot, CapyDrive, Freelance DevOps, OpenClaw, Content Generation, CBR Exam' },
            { name: 'author', content: 'Jimmy Nguyen' },
            { property: 'og:title', content: 'Autonomous Ops: Hermes Agent on Synology NAS' },
            { property: 'og:description', content: 'Containerized Hermes Agent on Synology NAS, free OpenRouter models, and Discord bot notifications for daily freelance radar and CapyDrive exam content.' },
            { property: 'og:image', content: 'assets/hermes-synology.jpg' },
            { property: 'og:url', content: 'https://stukongeluk.github.io/projects/hermes-synology' },
            { property: 'og:type', content: 'article' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'robots', content: 'index, follow' }
        ]);
    }

    async ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            try {
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'neutral',
                    securityLevel: 'loose',
                    fontFamily: 'Inter, sans-serif'
                });
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

    takeaways = [
        {
            title: 'Freelance Contract Radar',
            description: 'Scours Dutch tech boards every morning for high-yield DevOps/Cloud contracts (€95–€135+/hr), evaluating CV match scores and chance-to-apply.',
            icon: '🎯'
        },
        {
            title: 'CapyDrive Daily Exam Engine',
            description: 'Autonomously generates fresh, unique CBR-compliant driving theory questions, scenarios, and explanations daily, dispatching them straight to Discord.',
            icon: '🚗'
        },
        {
            title: 'Hermes Agent vs. OpenClaw',
            description: 'Hermes Agent features a closed self-improving learning loop with reliable tool execution, outperforming static chat relays like OpenClaw.',
            icon: '🥊'
        },
        {
            title: 'Discord Dispatch Center',
            description: 'Formats and delivers rich embed cards directly into dedicated Discord channels (#freelance-radar and #capydrive-content) without opening web portals.',
            icon: '💬'
        },
        {
            title: 'Zero Operating Costs',
            description: 'Runs lightly inside Docker on Synology Container Manager (<200MB RAM), routing reasoning through free models on OpenRouter with multi-model agility and zero API fees.',
            icon: '💰'
        },
        {
            title: 'Docker Sandboxing & Security',
            description: 'Containerized isolation ensures autonomous web scraping and agent tool executions remain strictly sandboxed from NAS shared folders, DSM root, and LAN subnets.',
            icon: '🛡️'
        }
    ];

    techStack = [
        { name: 'Docker & Compose', description: 'Container Orchestration' },
        { name: 'Synology DSM', description: 'Host OS & 24/7 Storage' },
        { name: 'Hermes Agent', description: 'Self-Improving Autonomous Agent' },
        { name: 'Discord Webhooks', description: 'Notification & Content Feeds' },
        { name: 'OpenRouter Free Models', description: 'Multi-Model Inference' },
        { name: 'CapyDrive Pipeline', description: 'EdTech Content Engine' }
    ];
}
