import {Component, ElementRef, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MetricsDashboardComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;
  private animationFrameId?: number;
  animated = false;

  readonly metrics: MetricCard[] = [
    { value: '0', numericEnd: 6, suffix: '+', label: 'YEARS OF EXPERIENCE', sublabel: 'distributed systems and AI platforms', barPct: 84, accent: 'green' },
    { value: '0', numericEnd: 50, suffix: 'K+', label: 'CONCURRENT SESSIONS', sublabel: 'Go SIP/PSTN telephony platform', barPct: 90, accent: 'gold' },
    { value: '0', numericEnd: 10, suffix: 'K+', label: 'EVENTS PER SECOND', sublabel: 'Kafka + AWS at sub-200ms P99', barPct: 86, accent: 'green' },
    { value: '0', numericEnd: 2, suffix: 'M+', label: 'DAILY TRANSACTIONS', sublabel: 'screened by real-time fraud pipelines', barPct: 88, accent: 'gold' },
    { value: '0', numericEnd: 2, suffix: '%', label: 'FRAUD FALSE NEGATIVES', sublabel: 'down from 12%', barPct: 92, accent: 'green' },
    { value: '0', numericEnd: 40, suffix: '%', label: 'KYC CONVERSION LIFT', sublabel: '100K+ daily users onboarding', barPct: 80, accent: 'gold' },
    { value: '0', numericEnd: 65, suffix: '%', label: 'SUPPORT WORKFLOWS AUTOMATED', sublabel: 'LLM-driven Slack bot', barPct: 82, accent: 'green' },
    { value: '0', numericEnd: 43, suffix: '%', label: 'SCHOOL ADOPTION GROWTH', sublabel: 'personalized learning systems', barPct: 72, accent: 'gold' },
    { value: '0', numericEnd: 9, suffix: '', label: 'OPEN-SOURCE PROJECTS', sublabel: 'npm, Maven Central, and MCP', barPct: 78, accent: 'green' },
  ];

  displayValues: string[] = [];

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {
    this.displayValues = this.metrics.map(() => '0');
  }

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateCounters();
          this.cdr.markForCheck();
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

      this.cdr.markForCheck();

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
      this.cdr.markForCheck();
    };

    this.animationFrameId = requestAnimationFrame(update);
  }

  private easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
}
