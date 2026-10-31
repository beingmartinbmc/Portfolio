import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'portfolio_play_mode';

/**
 * The portfolio reads as a professional site by default. Play mode is an opt-in layer that
 * turns on the game UI (XP bar, toasts, level-ups, mini-map, cursor trail, sounds) and swaps
 * `.pro-only` labels for their `.play-only` counterparts via the `play-mode` class on <html>.
 */
@Injectable({ providedIn: 'root' })
export class PlayModeService {
  readonly enabled = signal(readStored());

  constructor() {
    applyClass(this.enabled());
  }

  toggle(): void {
    this.set(!this.enabled());
  }

  set(on: boolean): void {
    this.enabled.set(on);
    applyClass(on);
    try { localStorage.setItem(STORAGE_KEY, String(on)); } catch { /* storage blocked: session-only */ }
  }
}

function readStored(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
}

function applyClass(on: boolean): void {
  document.documentElement.classList.toggle('play-mode', on);
}
