import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollXpService } from '../../services/scroll-xp.service';
import { AudioService } from '../../services/audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-level-up-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show) {
      <div class="levelup-overlay">
        <div class="levelup-card">
          <div class="levelup-stars">
            @for (s of stars; track s) {
              <span class="lu-star" [style.--i]="s">⭐</span>
            }
          </div>
          <div class="levelup-icon">🍄</div>
          <div class="levelup-label">LEVEL UP!</div>
          <div class="levelup-level">LVL {{ level }}</div>
          <div class="levelup-title">{{ title }}</div>
        </div>
      </div>
    }
  `,
  styles: [`
    .levelup-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      animation: overlayFade 2.5s ease forwards;
    }

    @keyframes overlayFade {
      0% { background: rgba(9, 9, 26, 0); }
      15% { background: rgba(9, 9, 26, 0.4); }
      85% { background: rgba(9, 9, 26, 0.4); }
      100% { background: rgba(9, 9, 26, 0); }
    }

    .levelup-card {
      position: relative;
      text-align: center;
      animation: cardPop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes cardPop {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.1); }
      100% { transform: scale(1); opacity: 1; }
    }

    .levelup-icon {
      font-size: 3.5rem;
      animation: iconSpin 0.8s ease;
    }

    @keyframes iconSpin {
      from { transform: rotate(-20deg) scale(0.5); }
      to { transform: rotate(0) scale(1); }
    }

    .levelup-label {
      font-family: var(--font-pixel);
      font-size: 1.4rem;
      color: #fbbf24;
      text-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 3px 3px 0 #d97706;
      letter-spacing: 0.1em;
      margin: 0.5rem 0;
      animation: labelGlow 1s ease-in-out infinite alternate;
    }

    @keyframes labelGlow {
      from { text-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 3px 3px 0 #d97706; }
      to { text-shadow: 0 0 32px rgba(251, 191, 36, 1), 3px 3px 0 #d97706; }
    }

    .levelup-level {
      font-family: var(--font-pixel);
      font-size: 0.8rem;
      color: #22c55e;
      margin-bottom: 0.25rem;
    }

    .levelup-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .levelup-stars {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .lu-star {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 1.2rem;
      animation: starBurst 1.2s ease-out forwards;
      animation-delay: calc(var(--i) * 0.06s);
      opacity: 0;
    }

    @keyframes starBurst {
      0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
      100% {
        opacity: 0;
        transform: translate(
          calc(-50% + cos(calc(var(--i) * 45deg)) * 140px),
          calc(-50% + sin(calc(var(--i) * 45deg)) * 140px)
        ) scale(1.2);
      }
    }
  `]
})
export class LevelUpOverlayComponent implements OnInit, OnDestroy {
  show = false;
  level = 1;
  title = '';
  stars = Array.from({ length: 8 }, (_, i) => i);
  private sub!: Subscription;

  constructor(private scrollXp: ScrollXpService, private audio: AudioService) {}

  ngOnInit(): void {
    this.sub = this.scrollXp.levelUp$.subscribe(event => {
      this.level = event.level;
      this.title = event.title;
      this.show = true;
      this.audio.play('levelUp');
      setTimeout(() => { this.show = false; }, 2500);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
