import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
    title: string;
    description: string;
    url: string;
    keywords?: string;
    author?: string;
    robots?: string;
    type?: 'website' | 'article';
    ogTitle?: string;
    ogDescription?: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageType?: string;
    imageAlt?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'Jimmy Nguyen';
const DEFAULT_AUTHOR = 'Jimmy Nguyen';
const DEFAULT_AUTHOR_URL = 'https://jimmynguyen.nl/';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private document: Document
    ) { }

    update(config: SeoConfig): void {
        const ogTitle = config.ogTitle ?? config.title;
        const ogDescription = config.ogDescription ?? config.description;
        const type = config.type ?? 'website';
        const author = config.author ?? DEFAULT_AUTHOR;
        const robots = config.robots ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

        this.titleService.setTitle(config.title);

        this.metaService.updateTag({ name: 'description', content: config.description });
        this.metaService.updateTag({ name: 'author', content: author });
        this.metaService.updateTag({ name: 'robots', content: robots });

        if (config.keywords) {
            this.metaService.updateTag({ name: 'keywords', content: config.keywords });
        } else {
            this.metaService.removeTag("name='keywords'");
        }

        // Open Graph
        this.metaService.updateTag({ property: 'og:type', content: type });
        this.metaService.updateTag({ property: 'og:site_name', content: SITE_NAME });
        this.metaService.updateTag({ property: 'og:locale', content: 'en_US' });
        this.metaService.updateTag({ property: 'og:title', content: ogTitle });
        this.metaService.updateTag({ property: 'og:description', content: ogDescription });
        this.metaService.updateTag({ property: 'og:url', content: config.url });

        if (config.image) {
            this.metaService.updateTag({ property: 'og:image', content: config.image });
            this.metaService.updateTag({ property: 'og:image:secure_url', content: config.image });
            if (config.imageWidth) {
                this.metaService.updateTag({ property: 'og:image:width', content: String(config.imageWidth) });
            } else {
                this.metaService.removeTag("property='og:image:width'");
            }
            if (config.imageHeight) {
                this.metaService.updateTag({ property: 'og:image:height', content: String(config.imageHeight) });
            } else {
                this.metaService.removeTag("property='og:image:height'");
            }
            if (config.imageType) {
                this.metaService.updateTag({ property: 'og:image:type', content: config.imageType });
            } else {
                this.metaService.removeTag("property='og:image:type'");
            }
            if (config.imageAlt) {
                this.metaService.updateTag({ property: 'og:image:alt', content: config.imageAlt });
            } else {
                this.metaService.removeTag("property='og:image:alt'");
            }
        }

        // Clear stale article:* tags before setting new ones
        this.removeMetaByProperty('article:published_time');
        this.removeMetaByProperty('article:modified_time');
        this.removeMetaByProperty('article:author');
        this.removeMetaByProperty('article:section');
        this.removeMetaByProperty('article:tag');

        if (type === 'article') {
            if (config.publishedTime) {
                this.metaService.updateTag({ property: 'article:published_time', content: config.publishedTime });
            }
            if (config.modifiedTime) {
                this.metaService.updateTag({ property: 'article:modified_time', content: config.modifiedTime });
            }
            this.metaService.updateTag({ property: 'article:author', content: DEFAULT_AUTHOR_URL });
            if (config.section) {
                this.metaService.updateTag({ property: 'article:section', content: config.section });
            }
            if (config.tags?.length) {
                for (const tag of config.tags) {
                    this.metaService.addTag({ property: 'article:tag', content: tag }, false);
                }
            }
        }

        // Twitter Card
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: ogTitle });
        this.metaService.updateTag({ name: 'twitter:description', content: ogDescription });
        if (config.image) {
            this.metaService.updateTag({ name: 'twitter:image', content: config.image });
            if (config.imageAlt) {
                this.metaService.updateTag({ name: 'twitter:image:alt', content: config.imageAlt });
            } else {
                this.metaService.removeTag("name='twitter:image:alt'");
            }
        }

        this.setCanonicalUrl(config.url);
        this.setJsonLd(config.jsonLd ?? null);
    }

    private removeMetaByProperty(property: string): void {
        const existing = this.document.head.querySelectorAll(`meta[property="${property}"]`);
        existing.forEach((node) => node.remove());
    }

    private setCanonicalUrl(url: string): void {
        let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    private setJsonLd(schema: Record<string, unknown> | null): void {
        const existing = this.document.head.querySelectorAll('script[type="application/ld+json"][data-seo-jsonld="true"]');
        existing.forEach((node) => node.remove());

        if (!schema) {
            return;
        }

        const script = this.document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(schema);
        this.document.head.appendChild(script);
    }
}
