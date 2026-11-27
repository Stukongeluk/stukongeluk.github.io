import { Component, DestroyRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Router, Scroll } from '@angular/router';

import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';
import { SeoService } from '../services/seo.service';
import { TrunksComponent } from '../leaves/trunks.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, ProjectsComponent, ContactComponent, TrunksComponent],
  template: `
    <app-hero></app-hero>
    <div class="grove">
      <app-trunks></app-trunks>
      <!-- Server-rendered in full (SEO, no layout shift); their code loads and
           hydrates once the browser is idle, keeping it out of the first bundle. -->
      @defer (on immediate; hydrate on idle) {
        <app-about></app-about>
        <app-projects></app-projects>
        <app-contact></app-contact>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    router: Router,
    private scroller: ViewportScroller,
    destroyRef: DestroyRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (!isPlatformBrowser(platformId)) return;
    // Coming from a write-up, the sections below the hero render a moment after
    // the route does, so the router finds no #about/#projects/#contact to scroll
    // to yet. Wait for the target to appear, then scroll to it.
    const sub = router.events.subscribe(e => {
      if (e instanceof Scroll && e.anchor) this.scrollWhenRendered(e.anchor);
    });
    destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private scrollWhenRendered(id: string): void {
    if (document.getElementById(id)) return;
    const start = performance.now();
    const tick = () => {
      if (document.getElementById(id)) {
        this.scroller.scrollToAnchor(id);
        // Images above the target can still grow the page; re-aim a couple of
        // times unless the visitor has started scrolling themselves.
        let userMoved = false;
        const stop = () => (userMoved = true);
        const opts = { once: true, passive: true } as const;
        addEventListener('wheel', stop, opts);
        addEventListener('touchstart', stop, opts);
        addEventListener('keydown', stop, opts);
        for (const ms of [400, 1000]) {
          setTimeout(() => { if (!userMoved) this.scroller.scrollToAnchor(id); }, ms);
        }
      } else if (performance.now() - start < 3000) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }

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
