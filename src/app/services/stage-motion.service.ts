import { Injectable, NgZone } from '@angular/core';

/** Cards that tilt toward the pointer. Hover lift uses `translate`, so this `transform` can compose with it. */
export const STAGE_REACTIVE_SELECTOR = [
  '.quest-card',
  '.side-quest-card',
  '.powerup-card',
  '.focus-card',
  '.scroll-card',
  '.level-card',
  '.skill-card',
  '.style-card',
  '.principle-card',
  '.hud-card',
  '.metric-card',
  '.metric-panel',
  '.arch-layer',
  '.map-stop',
  '.bio-panel',
  '.quest-panel',
].join(',');

@Injectable({ providedIn: 'root' })
export class StageMotionService {
  private started = false;
  private tiltTarget: HTMLElement | null = null;
  private frame = 0;
  private scrollIdle = 0;

  private readonly onPointer = (event: PointerEvent): void => {
    const root = document.documentElement;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    root.style.setProperty('--spot-x', ((event.clientX / w) * 100).toFixed(2));
    root.style.setProperty('--spot-y', ((event.clientY / h) * 100).toFixed(2));

    if (event.pointerType !== 'mouse') {
      this.clearTilt();
      return;
    }

    const raw = event.target;
    const card = raw instanceof Element
      ? raw.closest(STAGE_REACTIVE_SELECTOR) as HTMLElement | null
      : null;
    if (card !== this.tiltTarget) {
      this.clearTilt();
      this.tiltTarget = card;
    }
    if (!card) return;

    const rect = card.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const mag = root.classList.contains('play-mode') ? 1 : 0.45;
    card.style.setProperty('--rx', `${(-y * 8 * mag).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(x * 10 * mag).toFixed(2)}deg`);
  };

  private readonly onScroll = (): void => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const root = document.documentElement;
      root.style.setProperty('--scroll-y', String(Math.round(window.scrollY || 0)));
      root.classList.add('is-scrolling');
      window.clearTimeout(this.scrollIdle);
      this.scrollIdle = window.setTimeout(() => root.classList.remove('is-scrolling'), 140);
    });
  };

  start(zone: NgZone): void {
    if (this.started || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.started = true;
    zone.runOutsideAngular(() => {
      document.addEventListener('pointermove', this.onPointer, { passive: true });
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  stop(): void {
    if (!this.started) return;
    this.started = false;
    document.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('scroll', this.onScroll);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    window.clearTimeout(this.scrollIdle);
    document.documentElement.classList.remove('is-scrolling');
    this.clearTilt();
  }

  private clearTilt(): void {
    if (!this.tiltTarget) return;
    this.tiltTarget.style.removeProperty('--rx');
    this.tiltTarget.style.removeProperty('--ry');
    this.tiltTarget = null;
  }
}
