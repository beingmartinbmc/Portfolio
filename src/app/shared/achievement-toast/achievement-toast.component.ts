import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementsService, AchievementToast } from '../../services/achievements.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-achievement-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of visibleToasts; track toast.timestamp) {
        <div class="achievement-toast" [class.exiting]="toast.exiting">
          <div class="toast-confetti">
            @for (p of confettiParticles; track p) {
              <span class="confetti-piece" [style.--i]="p"></span>
            }
          </div>
          <div class="toast-icon">{{ toast.achievement.icon }}</div>
          <div class="toast-body">
            <span class="toast-label">ACHIEVEMENT UNLOCKED</span>
            <span class="toast-title">{{ toast.achievement.title }}</span>
            <span class="toast-desc">{{ toast.achievement.description }}</span>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
    }

    .achievement-toast {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1rem 1.4rem;
      border-radius: 16px;
      background: rgba(14, 14, 34, 0.95);
      border: 1.5px solid rgba(251, 191, 36, 0.5);
      box-shadow: 0 0 32px rgba(251, 191, 36, 0.25), 0 8px 32px rgba(0, 0, 0, 0.5);
      animation: toastIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      overflow: hidden;
      pointer-events: auto;
    }

    .achievement-toast.exiting {
      animation: toastOut 0.4s ease-in forwards;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(100%) scale(0.8); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }

    @keyframes toastOut {
      from { opacity: 1; transform: translateX(0) scale(1); }
      to { opacity: 0; transform: translateX(100%) scale(0.8); }
    }

    .toast-icon {
      font-size: 2rem;
      animation: iconBounce 0.6s 0.3s ease both;
    }

    @keyframes iconBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.4) rotate(-5deg); }
    }

    .toast-body {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .toast-label {
      font-family: var(--font-pixel);
      font-size: 0.5rem;
      letter-spacing: 0.2em;
      color: #fbbf24;
      text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
    }

    .toast-title {
      font-size: 1rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .toast-desc {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .toast-confetti {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .confetti-piece {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      top: 50%;
      left: 20%;
      animation: confettiBurst 1s ease-out forwards;
      animation-delay: calc(var(--i) * 0.05s);
      opacity: 0;
    }

    .confetti-piece:nth-child(odd) { background: #fbbf24; }
    .confetti-piece:nth-child(even) { background: #ef4444; }
    .confetti-piece:nth-child(3n) { background: #22c55e; }

    @keyframes confettiBurst {
      0% { opacity: 1; transform: translate(0, 0) scale(1); }
      100% {
        opacity: 0;
        transform: translate(
          calc((var(--i) - 5) * 18px),
          calc(-30px + var(--i) * 8px)
        ) scale(0.4) rotate(360deg);
      }
    }

    @media (max-width: 600px) {
      .toast-container {
        right: 0.75rem;
        left: 0.75rem;
        bottom: 1rem;
      }
    }
  `]
})
export class AchievementToastComponent implements OnInit, OnDestroy {
  visibleToasts: (AchievementToast & { exiting?: boolean })[] = [];
  confettiParticles = Array.from({ length: 10 }, (_, i) => i);
  private sub!: Subscription;

  constructor(private achievements: AchievementsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub = this.achievements.toast$.subscribe(toast => {
      this.visibleToasts.push({ ...toast, exiting: false });
      this.cdr.markForCheck();
      setTimeout(() => {
        const t = this.visibleToasts.find(x => x.timestamp === toast.timestamp);
        if (t) t.exiting = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.visibleToasts = this.visibleToasts.filter(x => x.timestamp !== toast.timestamp);
          this.cdr.markForCheck();
        }, 400);
      }, 4000);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
