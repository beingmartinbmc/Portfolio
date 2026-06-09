import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

/**
 * Reveals elements as they scroll into view. Add `appScrollReveal` to any element.
 * Supports stagger for children via `[revealStagger]`.
 *
 * Variants (via `revealAnim`):
 *  - fade-up (default)
 *  - pipe (clip-path circle wipe)
 *  - slide-left
 *  - scale-in
 *  - shake (boss impact)
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealAnim: 'fade-up' | 'pipe' | 'slide-left' | 'scale-in' | 'shake' = 'fade-up';
  @Input() revealStagger = 0;
  @Input() revealDelay = 0;
  @Input() revealOnce = true;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.classList.add('reveal-init', `reveal-${this.revealAnim}`);

    if (this.revealDelay) {
      host.style.transitionDelay = `${this.revealDelay}ms`;
    }

    if (this.revealStagger > 0) {
      Array.from(host.children).forEach((child, i) => {
        (child as HTMLElement).classList.add('reveal-init', 'reveal-fade-up');
        (child as HTMLElement).style.transitionDelay = `${i * this.revealStagger}ms`;
      });
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.activate(host);
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activate(host);
            if (this.revealOnce) this.observer?.unobserve(host);
          } else if (!this.revealOnce) {
            this.deactivate(host);
          }
        });
      },
      { threshold: 0.15 }
    );
    this.observer.observe(host);
  }

  private activate(host: HTMLElement): void {
    host.classList.add('reveal-active');
    if (this.revealStagger > 0) {
      Array.from(host.children).forEach(child => {
        (child as HTMLElement).classList.add('reveal-active');
      });
    }
  }

  private deactivate(host: HTMLElement): void {
    host.classList.remove('reveal-active');
    if (this.revealStagger > 0) {
      Array.from(host.children).forEach(child => {
        (child as HTMLElement).classList.remove('reveal-active');
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
