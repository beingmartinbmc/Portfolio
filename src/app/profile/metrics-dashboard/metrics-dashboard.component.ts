import {Component, ElementRef, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';

interface MetricCard {
  value: string;
  numericEnd: number;
  suffix: string;
  label: string;
  sublabel: string;
  barPct: number;
  accent: string;
}

@Component({
  selector: 'app-metrics-dashboard',
  templateUrl: './metrics-dashboard.component.html',
  styleUrls: ['./metrics-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class MetricsDashboardComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;
  private animationFrameId?: number;
  animated = false;

  readonly metrics: MetricCard[] = [
    { value: '0', numericEnd: 6, suffix: '+', label: 'YEARS OF EXPERIENCE', sublabel: 'backend and AI engineering', barPct: 84, accent: 'green' },
    { value: '0', numericEnd: 4, suffix: '', label: 'PRODUCT ORGANIZATIONS', sublabel: 'enterprise and consumer platforms', barPct: 72, accent: 'green' },
    { value: '0', numericEnd: 3, suffix: '', label: 'ARTICLES PUBLISHED', sublabel: 'engineering deep-dives', barPct: 60, accent: 'gold' },
    { value: '0', numericEnd: 8, suffix: '', label: 'OPEN-SOURCE PACKAGES', sublabel: 'developer tools and experiments', barPct: 78, accent: 'gold' },
    { value: '0', numericEnd: 7, suffix: '', label: 'AI / ML SKILL AREAS', sublabel: 'agents, retrieval, evals, and tooling', barPct: 86, accent: 'green' },
    { value: '0', numericEnd: 8, suffix: '', label: 'ARCHITECTURE LAYERS', sublabel: 'from runtime to AI systems', barPct: 82, accent: 'gold' },
    { value: '0', numericEnd: 3, suffix: '', label: 'PLAYABLE GAME MODES', sublabel: 'ground, sea, and sky', barPct: 58, accent: 'gold' },
    { value: '0', numericEnd: 21, suffix: '', label: 'MODERN JAVA', sublabel: 'experience through Java 21', barPct: 90, accent: 'green' },
    { value: '0', numericEnd: 500, suffix: '+', label: 'DSA PROBLEMS', sublabel: 'problem-solving practice', barPct: 88, accent: 'gold' },
  ];

  displayValues: string[] = [];

  constructor(private el: ElementRef) {
    this.displayValues = this.metrics.map(() => '0');
  }

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private animateCounters(): void {
    const duration = 1800;
    const startedAt = performance.now();

    const update = (now: number) => {
      const elapsed = Math.min(now - startedAt, duration);
      const progress = this.easeOutExpo(elapsed / duration);

      this.metrics.forEach((metric, idx) => {
        const current = metric.numericEnd * progress;

        if (Number.isInteger(metric.numericEnd)) {
          this.displayValues[idx] = Math.round(current).toLocaleString();
        } else {
          this.displayValues[idx] = current.toFixed(current < 10 ? 2 : 1);
        }
      });

      if (elapsed < duration) {
        this.animationFrameId = requestAnimationFrame(update);
        return;
      }

      this.animationFrameId = undefined;
      this.displayValues = this.metrics.map(metric =>
        Number.isInteger(metric.numericEnd)
          ? metric.numericEnd.toLocaleString()
          : metric.numericEnd.toString()
      );
    };

    this.animationFrameId = requestAnimationFrame(update);
  }

  private easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
}
