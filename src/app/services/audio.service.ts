import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type SfxName = 'coin' | 'levelUp' | 'powerUp' | 'pipe' | 'jump' | 'star' | 'click';

interface WebkitAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly STORAGE_KEY = 'portfolio_sfx_enabled';
  private ctx: AudioContext | null = null;

  readonly enabled$ = new BehaviorSubject<boolean>(false);

  constructor() {
    try {
      this.enabled$.next(localStorage.getItem(this.STORAGE_KEY) === 'true');
    } catch { /* ignore */ }
  }

  toggle(): void {
    const next = !this.enabled$.value;
    this.enabled$.next(next);
    try { localStorage.setItem(this.STORAGE_KEY, String(next)); } catch { /* ignore */ }
    if (next) {
      this.ensureContext();
      this.play('click');
    }
  }

  get enabled(): boolean {
    return this.enabled$.value;
  }

  private ensureContext(): void {
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as WebkitAudioWindow).webkitAudioContext;
      if (Ctor) this.ctx = new Ctor();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { /* ignore */ });
    }
  }

  play(name: SfxName): void {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    switch (name) {
      case 'coin':
        this.tone([988, 1319], 0.08, 'square', 0.12);
        break;
      case 'levelUp':
        this.sequence([523, 659, 784, 1047], 0.1, 'square', 0.12);
        break;
      case 'powerUp':
        this.sweep(440, 880, 0.18, 'square', 0.1);
        break;
      case 'pipe':
        this.sweep(660, 220, 0.2, 'sine', 0.1);
        break;
      case 'jump':
        this.sweep(330, 740, 0.14, 'square', 0.1);
        break;
      case 'star':
        this.sequence([784, 988, 1319, 1568, 2093], 0.07, 'triangle', 0.1);
        break;
      case 'click':
        this.tone([660], 0.05, 'square', 0.08);
        break;
    }
  }

  private tone(freqs: number[], duration: number, type: OscillatorType, gain: number): void {
    freqs.forEach((f, i) => this.beep(f, this.ctx!.currentTime + i * duration, duration, type, gain));
  }

  private sequence(freqs: number[], step: number, type: OscillatorType, gain: number): void {
    freqs.forEach((f, i) => this.beep(f, this.ctx!.currentTime + i * step, step, type, gain));
  }

  private sweep(from: number, to: number, duration: number, type: OscillatorType, gain: number): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(to, this.ctx.currentTime + duration);
    g.gain.setValueAtTime(gain, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    osc.connect(g).connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  private beep(freq: number, startTime: number, duration: number, type: OscillatorType, gain: number): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    g.gain.setValueAtTime(gain, startTime);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}
