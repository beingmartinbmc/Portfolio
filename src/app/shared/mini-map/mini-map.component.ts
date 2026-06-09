import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

interface MapNode {
  id: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-mini-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="mini-map" [class.mini-map--hidden]="hideMap" aria-label="Section navigator">
      <div class="map-rail">
        @for (node of nodes; track node.id) {
          <button class="map-node"
                  [class.active]="currentSection === node.id"
                  [attr.aria-label]="'Go to ' + node.label"
                  (click)="scrollTo(node.id)">
            <span class="node-icon">{{ node.icon }}</span>
            <span class="node-tooltip">{{ node.label }}</span>
          </button>
        }

        <!-- Divider -->
        <div class="rail-divider"></div>

        <!-- SFX Toggle -->
        <button class="map-node sfx-node" [class.sfx-on]="sfxEnabled"
                (click)="toggleSfx()"
                [attr.aria-label]="sfxEnabled ? 'Disable sound effects' : 'Enable sound effects'"
                [title]="sfxEnabled ? 'Sound ON' : 'Sound OFF'">
          <span class="node-icon">{{ sfxEnabled ? '🔊' : '🔇' }}</span>
          <span class="node-tooltip">{{ sfxEnabled ? 'Mute' : 'Unmute' }}</span>
        </button>

        <div class="mario-indicator" [style.top.%]="marioTop">🍄</div>
      </div>
    </nav>
  `,
  styles: [`
    .mini-map {
      position: fixed;
      right: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 900;
      transition: opacity 0.3s, transform 0.3s;
    }

    .mini-map--hidden {
      opacity: 0;
      pointer-events: none;
      transform: translateY(-50%) translateX(20px);
    }

    .map-rail {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 0.5rem;
      border-radius: 20px;
      background: rgba(14, 14, 34, 0.85);
      border: 1px solid rgba(251, 191, 36, 0.15);
      backdrop-filter: blur(8px);
    }

    .map-node {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.85rem;
      border-radius: 50%;
      transition: all 0.25s;
    }

    .map-node:hover, .map-node.active {
      background: rgba(251, 191, 36, 0.15);
      transform: scale(1.2);
    }

    .map-node.active .node-icon {
      filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.8));
    }

    .map-node.active::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 1.5px solid rgba(251, 191, 36, 0.5);
      animation: ringPulse 2s ease-in-out infinite;
    }

    @keyframes ringPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.3; }
    }

    .node-tooltip {
      position: absolute;
      right: calc(100% + 10px);
      white-space: nowrap;
      font-size: 0.65rem;
      font-weight: 600;
      color: #f8fafc;
      background: rgba(14, 14, 34, 0.95);
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    .map-node:hover .node-tooltip {
      opacity: 1;
    }

    .rail-divider {
      width: 16px;
      height: 1px;
      background: rgba(251, 191, 36, 0.2);
      margin: 0.15rem 0;
    }

    .sfx-node.sfx-on {
      background: rgba(34, 197, 94, 0.15);
    }

    .sfx-node.sfx-on .node-icon {
      filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.7));
    }

    .mario-indicator {
      position: absolute;
      left: -16px;
      font-size: 1rem;
      transition: top 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      pointer-events: none;
      filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.5));
    }

    @media (max-width: 768px) {
      .mini-map { display: none; }
    }
  `]
})
export class MiniMapComponent implements OnInit, OnDestroy {
  readonly nodes: MapNode[] = [
    { id: 'about', icon: '🗡', label: 'About' },
    { id: 'avatar-3d', icon: '🤖', label: 'AI Twin' },
    { id: 'skill', icon: '⚔', label: 'Skills' },
    { id: 'experience', icon: '🗺', label: 'Experience' },
    { id: 'metrics', icon: '📊', label: 'Metrics' },
    { id: 'publications', icon: '🏰', label: 'Projects' },
    { id: 'blogs', icon: '📜', label: 'Writing' },
    { id: 'ai-quiz-game', icon: '🕹', label: 'Game' },
    { id: 'education', icon: '🏫', label: 'Education' },
    { id: 'operating-style', icon: '🎮', label: 'Profile' },
  ];

  currentSection = '';
  marioTop = 0;
  hideMap = true;
  sfxEnabled = false;

  private observer: IntersectionObserver | null = null;
  private scrollListener: (() => void) | null = null;
  private audioSub: { unsubscribe(): void } | null = null;

  constructor(private audio: AudioService) {}

  ngOnInit(): void {
    this.audioSub = this.audio.enabled$.subscribe(e => this.sfxEnabled = e);

    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
          this.currentSection = visible[0].target.id;
          const idx = this.nodes.findIndex(n => n.id === this.currentSection);
          if (idx >= 0) this.marioTop = (idx / (this.nodes.length - 1)) * 92;
        }
      },
      { threshold: 0.2 }
    );

    setTimeout(() => {
      this.nodes.forEach(n => {
        const el = document.getElementById(n.id);
        if (el && this.observer) this.observer.observe(el);
      });
    }, 500);

    // Show after scrolling past hero
    this.scrollListener = () => {
      this.hideMap = window.scrollY < 400;
    };
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.scrollListener) window.removeEventListener('scroll', this.scrollListener);
    this.audioSub?.unsubscribe();
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleSfx(): void {
    this.audio.toggle();
  }
}
