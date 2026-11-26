import { Directive, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type RevealMode = '' | 'draw';

const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function sharedObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      callbacks.get(entry.target)?.();
      callbacks.delete(entry.target);
      observer!.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  return observer;
}

/**
 * Fades an element up as it scrolls into view.
 *
 * The server-rendered HTML is never hidden: only elements that are still below the
 * fold once the app is running get hidden and then revealed, so crawlers, no-JS
 * visitors and the first screen are unaffected.
 *
 * Usage: `<div appReveal>`, `<div appReveal [revealDelay]="120">`,
 * `<svg appReveal="draw">` (adds `is-drawn` to start an ensō stroke animation).
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  @Input() appReveal: RevealMode = '';
  @Input() revealDelay = 0;

  constructor(private el: ElementRef<HTMLElement>, @Inject(PLATFORM_ID) platformId: Object) {
    if (!isPlatformBrowser(platformId)) return;
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    const node = this.el.nativeElement;
    const draw = this.appReveal === 'draw';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rect = node.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

    if (draw) {
      // Strokes are cheap to hide: they only start drawing once seen.
      if (inView || reduced) {
        node.classList.add('is-drawn');
      } else {
        callbacks.set(node, () => node.classList.add('is-drawn'));
        sharedObserver().observe(node);
      }
      return;
    }

    if (inView || reduced || !('IntersectionObserver' in window)) return;

    node.classList.add('reveal-pending');
    callbacks.set(node, () => {
      node.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);
      node.classList.remove('reveal-pending');
      // `is-in` stays on, so the element's contents can play their own
      // staggered entrance (tags popping in, images unveiling, lines drawing).
      node.classList.add('reveal-in', 'is-in');
      // Drop the class afterwards so hover transforms work again.
      const done = (e: AnimationEvent) => {
        if (e.target !== node) return;
        node.classList.remove('reveal-in');
        node.removeEventListener('animationend', done);
      };
      node.addEventListener('animationend', done);
    });
    sharedObserver().observe(node);
  }

  ngOnDestroy(): void {
    const node = this.el.nativeElement;
    if (observer && callbacks.has(node)) {
      observer.unobserve(node);
      callbacks.delete(node);
    }
  }
}
