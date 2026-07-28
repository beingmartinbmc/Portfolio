import { ChangeDetectorRef, Component, NgZone, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  id: number;
  x: number;
  y: number;
  dying: boolean;
}

@Component({
  selector: 'app-cursor-trail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trail-layer">
      @for (p of particles; track p.id) {
        <span class="trail-particle" [class.dying]="p.dying"
              [style.left.px]="p.x" [style.top.px]="p.y">✦</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .trail-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99998;
      overflow: hidden;
    }

    .trail-particle {
      position: absolute;
      font-size: 0.6rem;
      color: #fbbf24;
      opacity: 0.8;
      animation: particleFade 0.6s ease-out forwards;
      pointer-events: none;
      text-shadow: 0 0 4px rgba(251, 191, 36, 0.6);
    }

    .trail-particle.dying {
      animation: particleDie 0.3s ease-out forwards;
    }

    @keyframes particleFade {
      0% { opacity: 0.8; transform: scale(1) translateY(0); }
      100% { opacity: 0; transform: scale(0.3) translateY(-8px); }
    }

    @keyframes particleDie {
      to { opacity: 0; transform: scale(0); }
    }

    @media (pointer: coarse) {
      .trail-layer { display: none; }
    }
  `]
})
export class CursorTrailComponent implements OnInit, OnDestroy {
  particles: Particle[] = [];
  private nextId = 0;
  private moveHandler: ((e: MouseEvent) => void) | null = null;
  private frameCount = 0;
  private animationFrameId: number | null = null;
  private pendingPointer: { x: number; y: number } | null = null;
  private readonly removalTimers = new Set<ReturnType<typeof setTimeout>>();

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (typeof window === 'undefined') return;
    // Only run when pointer and motion preferences make the effect appropriate.
    if (
      window.matchMedia('(pointer: coarse)').matches
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    this.zone.runOutsideAngular(() => {
      this.moveHandler = (e: MouseEvent) => {
        this.frameCount++;
        if (this.frameCount % 3 !== 0) return;
        this.pendingPointer = { x: e.clientX, y: e.clientY };
        if (this.animationFrameId !== null) return;
        this.animationFrameId = requestAnimationFrame(() => {
          this.animationFrameId = null;
          const pointer = this.pendingPointer;
          this.pendingPointer = null;
          if (pointer) this.spawn(pointer.x, pointer.y);
        });
      };
      window.addEventListener('mousemove', this.moveHandler, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (this.moveHandler) {
      window.removeEventListener('mousemove', this.moveHandler);
    }
    if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
    this.removalTimers.forEach(timer => clearTimeout(timer));
    this.removalTimers.clear();
  }

  private spawn(x: number, y: number): void {
    const id = this.nextId++;
    this.particles.push({ id, x: x - 4, y: y - 4, dying: false });

    // Keep max 20 particles
    if (this.particles.length > 20) {
      this.particles.shift();
    }

    // Auto-remove after animation
    const timer = setTimeout(() => {
      this.particles = this.particles.filter(p => p.id !== id);
      this.removalTimers.delete(timer);
      this.cdr.detectChanges();
    }, 600);
    this.removalTimers.add(timer);
    this.cdr.detectChanges();
  }
}
