import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, QueryList, ViewChildren } from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { RevealDirective } from '../shared/reveal.directive';
import { LeafCanopyComponent } from '../leaves/leaf-canopy.component';

interface SkillGroup { numeral: string; title: string; tags: string[]; description: string; }
interface Sector { title: string; description: string; }
interface Certification { title: string; issuer: string; description: string; tags: string[]; }
interface Hobby { title: string; caption: string; image?: string; video?: string; poster?: string; alt: string; width: number; height: number; position?: string; }

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, NgOptimizedImage, LeafCanopyComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('hobbyVideo') private hobbyVideos!: QueryList<ElementRef<HTMLVideoElement>>;
  private videoObserver?: IntersectionObserver;

  readonly skills: SkillGroup[] = [
    {
      numeral: '一', title: 'Full-stack',
      tags: ['Java (Spring/Quarkus)', 'TypeScript', 'Python', 'Angular 21 (Signals)', 'PostgreSQL', 'REST & SOAP'],
      description: 'Building reactive web applications, scalable microservices, and distributed systems with clean architecture.'
    },
    {
      numeral: '二', title: 'DevOps & DevEx',
      tags: ['Docker', 'Kubernetes (CKAD)', 'Terraform', 'GitHub Actions', 'GitLab CI/CD', 'Golang DevEx'],
      description: 'Automating multi-account CI/CD, building Golang DevEx CLI tools, and embedding Sigrid & Snyk security scans.'
    },
    {
      numeral: '三', title: 'Cloud & Serverless',
      tags: ['AWS (Lambda/CDK)', 'GCP / Firebase', 'Red Hat OpenShift', 'CloudFormation', 'CloudWatch & Alerting', 'DynamoDB'],
      description: 'Designing event-driven serverless backends, multi-account AWS topologies, and cloud-native solutions.'
    },
    {
      numeral: '四', title: 'Forward Deploy',
      tags: ['Auth0 & Entra ID', 'Solution Architecture', 'Rapid Delivery', 'Production Rollout', 'Claude & MCP Tooling', 'Troubleshooting'],
      description: 'Deploying mission-critical systems into client environments with end-to-end technical ownership.'
    },
  ];

  readonly sectors: Sector[] = [
    { title: 'Government', description: 'GovTech corporate tax applications (Belastingdienst) and meteorology & climate data systems on AWS (KNMI).' },
    { title: 'IT & Software', description: 'EdTech SaaS (Capydrive), international fleet management (Flottando), and event registration platforms (Aanmelder.nl).' },
    { title: 'Energy', description: 'AWS Serverless migrations, 24/7 CloudWatch monitoring, and enterprise integrations with SAP/BPM (Essent).' },
    { title: 'Transport', description: 'Public transit driver mobile tools, real-time journey planners, and GraphQL transit APIs (Qbuzz).' },
    { title: 'Healthcare', description: 'Enterprise .NET Core & Java Spring Boot APIs and SPAs on AWS for healthcare financing (PharmAccess).' },
    { title: 'Media', description: 'Core Java microservices and automated CI/CD deployment pipelines for digital subscription processing (DPG Media).' },
    { title: 'HR & Recruitment', description: 'Multi-account AWS infrastructure, zero-downtime Auth0 identity migration, and Golang DevEx CLI tools (HeadFirst Group).' },
    { title: 'Consulting', description: 'Hands-on technical advisory, rapid prototyping, and end-to-end delivery across complex enterprise ecosystems.' },
  ];

  readonly certifications: Certification[] = [
    {
      title: 'CKAD: Certified Kubernetes Application Developer', issuer: 'Linux Foundation',
      description: 'Hands-on certification for designing, building, containerizing, and deploying cloud-native applications on Kubernetes.',
      tags: ['Kubernetes', 'CKAD', 'Containers', 'Cloud Native']
    },
    {
      title: 'AWS Certified DevOps Engineer – Professional', issuer: 'Amazon Web Services',
      description: 'Provisioning, operating, and managing distributed application systems, automated CI/CD pipelines, and multi-account AWS environments.',
      tags: ['AWS DevOps Pro', 'IaC', 'CI/CD', 'Automation']
    },
    {
      title: 'AWS Solutions Architect & Developer Associate', issuer: 'Amazon Web Services',
      description: 'Designing resilient, secure, high-performing architectures and developing serverless cloud applications on AWS.',
      tags: ['Solutions Architect', 'Developer Associate', 'Serverless']
    },
    {
      title: 'Oracle Certified Professional (OCP) & OCA', issuer: 'Oracle (Java SE 8)',
      description: 'Foundational software craftsmanship, object-oriented design principles, concurrency, memory models, and JVM internals.',
      tags: ['Java SE', 'OCP', 'OCA', 'Clean Code']
    },
    {
      title: 'Model Context Protocol (MCP) & AI Agent Skills', issuer: 'Anthropic / Advanced Topics',
      description: 'Pragmatically integrating Claude AI skills and Model Context Protocol (MCP) tooling into software delivery pipelines and engineering workflows.',
      tags: ['Claude', 'MCP', 'AI SDLC', 'Developer Velocity']
    },
    {
      title: 'BSc. Computer Science (Informatica)', issuer: 'Hogeschool Leiden (2014 – 2018)',
      description: 'Rigorous 4-year degree in software engineering, distributed systems, data structures, algorithms, and full-stack development.',
      tags: ['BSc Informatica', 'Hogeschool Leiden', 'Computer Science']
    },
  ];

  readonly hobbies: Hobby[] = [
    { title: 'Skateboarding', caption: 'Landing ollies and more', video: 'assets/ollie.webm', alt: 'Jimmy doing an ollie on his skateboard', width: 4, height: 5 },
    { title: 'Bouldering', caption: 'Climbing to new heights', image: 'assets/boulder_optimized.webp', alt: 'Jimmy bouldering on an indoor climbing wall', width: 800, height: 1067 },
    { title: 'More skating', caption: 'Treflips and tricks', video: 'assets/tre.webm', alt: 'Jimmy landing a treflip', width: 4, height: 5 },
    { title: 'Gaming', caption: 'Achievement hunter', image: 'assets/Screenshot 2024-01-31 at 18.30.07.webp', alt: 'Jimmy\'s Steam completionist showcase with 100% achievements in Hades', width: 960, height: 362, position: '12% center' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Videos only download and play once they are near the screen, so they never
    // compete with the first paint. Angular sets `muted` as an attribute, not the DOM
    // property, so force it before calling play() or browsers block autoplay.
    this.videoObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          if (!video.src) {
            video.src = video.dataset['src'] ?? '';
          }
          video.play().catch(() => { /* blocked (e.g. Low Power Mode) - ignore */ });
        } else if (!video.paused) {
          video.pause();
        }
      }
    }, { rootMargin: '200px 0px' });

    this.hobbyVideos.forEach(({ nativeElement: video }) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      this.videoObserver!.observe(video);
    });
  }

  ngOnDestroy(): void {
    this.videoObserver?.disconnect();
  }
}
