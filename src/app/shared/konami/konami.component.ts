import { Component, HostListener, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsService } from '../../services/achievements.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-konami',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (godMode) {
      <div class="god-mode-overlay">
        <div class="god-mode-flash"></div>
        <div class="god-mode-text">
          <span class="gm-star">🌟</span>
          <span class="gm-label">GOD MODE ACTIVATED</span>
          <span class="gm-sub">All stats maxed</span>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .god-mode-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      animation: gmFade 10s ease forwards;
    }

    @keyframes gmFade {
      0% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }

    .god-mode-flash {
      position: absolute;
      inset: 0;
      animation: rainbowFlash 0.5s ease 3;
    }

    @keyframes rainbowFlash {
      0% { background: rgba(239, 68, 68, 0.15); }
      16% { background: rgba(251, 191, 36, 0.15); }
      33% { background: rgba(34, 197, 94, 0.15); }
      50% { background: rgba(56, 189, 248, 0.15); }
      66% { background: rgba(168, 85, 247, 0.15); }
      83% { background: rgba(236, 72, 153, 0.15); }
      100% { background: rgba(239, 68, 68, 0.15); }
    }

    .god-mode-text {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: textPop 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes textPop {
      from { transform: scale(0.3); }
      to { transform: scale(1); }
    }

    .gm-star {
      font-size: 4rem;
      animation: starSpin 2s linear infinite;
    }

    @keyframes starSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .gm-label {
      font-family: var(--font-pixel);
      font-size: 1.2rem;
      letter-spacing: 0.15em;
      background: linear-gradient(90deg, #ef4444, #fbbf24, #22c55e, #38bdf8, #a855f7, #ec4899);
      background-size: 300% 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: rainbowText 2s linear infinite;
      margin-top: 0.5rem;
    }

    @keyframes rainbowText {
      from { background-position: 0% 50%; }
      to { background-position: 300% 50%; }
    }

    .gm-sub {
      font-size: 0.9rem;
      color: #f8fafc;
      margin-top: 0.3rem;
    }
  `]
})
export class KonamiComponent implements OnDestroy {
  godMode = false;
  private sequence: string[] = [];
  private readonly code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private achievements: AchievementsService, private audio: AudioService, private cdr: ChangeDetectorRef) {}

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    this.sequence.push(event.key);
    if (this.sequence.length > this.code.length) {
      this.sequence.shift();
    }

    if (JSON.stringify(this.sequence) === JSON.stringify(this.code)) {
      this.activateGodMode();
      this.sequence = [];
    }
  }

  private activateGodMode(): void {
    this.godMode = true;
    this.audio.play('star');
    this.achievements.unlock('code_breaker');

    // Add rainbow class to body
    document.body.classList.add('god-mode');

    this.timer = setTimeout(() => {
      this.godMode = false;
      document.body.classList.remove('god-mode');
      this.cdr.markForCheck();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    document.body.classList.remove('god-mode');
  }
}
