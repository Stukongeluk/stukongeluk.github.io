import { Component, OnInit } from '@angular/core';

import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, ProjectsComponent, ContactComponent],
  template: `
    <app-hero></app-hero>
    <app-about></app-about>
    <app-projects></app-projects>
    <app-contact></app-contact>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) { }

  ngOnInit(): void {
    const description = 'Jimmy Nguyen - Senior DevOps Engineer & Full-Stack Developer with 10 years of experience across Cloud, Serverless, Kubernetes (CKAD), Golang DevEx tooling, and Forward Deploy capabilities.';
    this.seoService.update({
      title: 'Jimmy Nguyen | Senior DevOps Engineer & Full-Stack Developer',
      description,
      url: 'https://jimmynguyen.nl/',
      type: 'website',
      keywords: 'Jimmy Nguyen, Senior DevOps Engineer, Full-Stack Developer, Cloud Engineer, Forward Deploy Engineer, CKAD, AWS Certified, Terraform, Kubernetes, Docker, Angular, Java, Spring Boot, Quarkus, Golang, Python, Auth0, Claude, MCP',
      image: 'https://jimmynguyen.nl/assets/og/home.jpg',
      imageWidth: 1200,
      imageHeight: 630,
      imageType: 'image/jpeg',
      imageAlt: 'Jimmy Nguyen, Senior DevOps Engineer and Full-Stack Developer, with his pixel-art portrait on a hanging scroll beside a bonsai',
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
            description,
            publisher: { '@id': 'https://jimmynguyen.nl/#person' }
          }
        ]
      }
    });
  }
}
