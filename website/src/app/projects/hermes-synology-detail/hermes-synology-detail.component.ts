import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { SuperSaiyanService } from '../../services/super-saiyan.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { WriteupBackdropComponent } from '../../shared/writeup-backdrop.component';

@Component({
    selector: 'app-hermes-synology-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, RevealDirective, WriteupBackdropComponent],
    templateUrl: './hermes-synology-detail.component.html',
    styleUrl: './hermes-synology-detail.component.css'
})
export class HermesSynologyDetailComponent implements OnInit, AfterViewInit {
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
            title: 'Autonomous Ops: Hermes Agent on Synology NAS | Jimmy Nguyen',
            ogTitle: 'Autonomous Ops: Hermes Agent on Synology NAS',
            description: 'How I built a 24/7 autonomous bot on Synology NAS with Docker, Hermes Agent, and Discord to power daily freelance contract radar and automated CBR exam question generation for CapyDrive.',
            ogDescription: 'Containerized Hermes Agent on Synology NAS, free OpenRouter models, and Discord bot notifications for daily freelance radar and CapyDrive exam content.',
            url: 'https://jimmynguyen.nl/projects/hermes-synology/',
            type: 'article',
            keywords: 'Hermes Agent, NousResearch, Synology NAS, Docker, Discord Bot, CapyDrive, Freelance DevOps, OpenClaw, Content Generation, CBR Exam',
            image: 'https://jimmynguyen.nl/assets/og/hermes-synology.jpg',
            imageWidth: 1200,
            imageHeight: 630,
            imageType: 'image/jpeg',
            imageAlt: 'Autonomous Ops: Hermes Agent on a Synology NAS, a project write-up by Jimmy Nguyen'
        });
    }

    async ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            try {
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
            title: 'CapyDrive TikTok Marketing Engine',
            description: 'Autonomously generates fresh CBR quiz dilemmas, viral hooks, and scenario scripts daily, dispatching them to Discord for quick TikTok video creation.',
            icon: '🎬'
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
