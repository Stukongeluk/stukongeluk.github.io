import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Project {
  title: string;
  description: string;
  image?: string;
  link?: string;
  route?: string;
  tags: string[];
  featured?: boolean;
}

import { SuperSaiyanService } from '../services/super-saiyan.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  constructor(public superSaiyan: SuperSaiyanService) { }
  projects = signal<Project[]>([
    {
      title: 'The Human C-Suite: AI Agent Skills',
      description: 'Open-source agent skills that make an AI agent think like a humane CEO, CTO and CPTO: grounded in company data, layoffs as the last resort, AI measured before anyone banks on it. Built and tested with the skill-creator loop.',
      link: 'https://github.com/Stukongeluk/the-human-c-suite',
      image: 'assets/the-human-c-suite.jpg',
      route: '/projects/the-human-c-suite',
      tags: ['Agent Skills', 'Claude', 'MCP', 'Leadership', 'Open Source'],
      featured: true
    },
    {
      title: 'CapyDrive (EdTech SaaS)',
      description: 'Founder & Lead Engineer. Gamified micro-learning platform for driving theory education. Built with an ultra-fast Angular 21 Signals client and event-driven GCP / Firebase serverless backend with near-zero idle costs.',
      link: 'https://capydrive.eu',
      image: 'assets/logo.png',
      route: '/projects/capydrive',
      tags: ['Angular 21 (Signals)', 'TypeScript', 'Firebase', 'GCP', 'TailwindCSS'],
      featured: true
    },
    {
      title: 'Autonomous Ops: Hermes Agent on Synology NAS',
      description: 'A 24/7 autonomous AI agent in Docker on my Synology NAS using free models on OpenRouter and Discord. Powers daily freelance contract scanning with CV match scoring, and automated daily CBR TikTok marketing content for CapyDrive.',
      image: 'assets/hermes-synology.jpg',
      route: '/projects/hermes-synology',
      tags: ['Docker', 'Synology NAS', 'Hermes Agent', 'Discord Bot', 'CapyDrive', 'Automation'],
      featured: true
    }
  ]);
}
