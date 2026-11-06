import { Injectable, NgZone } from '@angular/core';

/** Cards that tilt toward the pointer. Hover lift uses `translate`, so the inline tilt `transform` composes with it. */
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
  private spotTargets: HTMLElement[] = [];
  private frame = 0;
  private scrollIdle = 0;

  private readonly onPointer = (event: PointerEvent): void => {
    const root = document.documentElement;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    this.setSpot(((event.clientX / w) * 100).toFixed(2), ((event.clientY / h) * 100).toFixed(2));

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
    // Inline, so a card only leaves its normal rendering path while it is actually tilted.
    card.style.transform = `perspective(900px) rotateX(${(-y * 8 * mag).toFixed(2)}deg) rotateY(${(x * 10 * mag).toFixed(2)}deg)`;
  };

  private readonly onScroll = (): void => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const root = document.documentElement;
      root.classList.add('is-scrolling');
      window.clearTimeout(this.scrollIdle);
      this.scrollIdle = window.setTimeout(() => root.classList.remove('is-scrolling'), 140);
    });
  };

  /** Pointer left the window: no pointermove will follow to un-tilt the last card. */
  private readonly onLeave = (): void => this.clearTilt();

  /**
   * The light and the hero title are the only readers. Set the vars on them, not on <html>:
   * an inherited custom property on the root restyles the whole document on every pointermove.
   */
  private setSpot(x: string, y: string): void {
    if (!this.spotTargets[0]?.isConnected) {
      this.spotTargets = Array.from(document.querySelectorAll<HTMLElement>('.stage-light, .hero-title'));
    }
    for (const el of this.spotTargets) {
      el.style.setProperty('--spot-x', x);
      el.style.setProperty('--spot-y', y);
    }
  }

  start(zone: NgZone): void {
    if (this.started || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.started = true;
    zone.runOutsideAngular(() => {
      document.addEventListener('pointermove', this.onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.onLeave);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  stop(): void {
    if (!this.started) return;
    this.started = false;
    document.removeEventListener('pointermove', this.onPointer);
    document.documentElement.removeEventListener('pointerleave', this.onLeave);
    window.removeEventListener('scroll', this.onScroll);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    window.clearTimeout(this.scrollIdle);
    document.documentElement.classList.remove('is-scrolling');
    this.clearTilt();
  }

  private clearTilt(): void {
    if (!this.tiltTarget) return;
    this.tiltTarget.style.removeProperty('transform');
    this.tiltTarget = null;
  }
}
