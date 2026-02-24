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
      title: 'CapyDrive',
      description: 'A modern, affordable SaaS for Dutch driving theory exams. Built with a serverless architecture to keep costs low while providing a premium experience.',
      image: 'assets/logo.png',
      route: '/projects/capydrive',
      tags: ['Angular', 'Firebase', 'Serverless', 'Mollie'],
      featured: true
    }
  ]);
}
