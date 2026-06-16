import {Component, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';

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
  standalone: true,
  imports: [CommonModule]
})
export class MetricsDashboardComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;
  animated = false;

  readonly metrics: MetricCard[] = [
    { value: '0', numericEnd: 5547, suffix: '', label: 'PEAK THROUGHPUT', sublabel: 'requests per second', barPct: 92, accent: 'green' },
    { value: '0', numericEnd: 19.9, suffix: 'M', label: 'REQUESTS / HOUR', sublabel: 'fraud rule evaluations', barPct: 88, accent: 'green' },
    { value: '0', numericEnd: 7.16, suffix: 'M', label: 'HAND-HISTORY OPS/SEC', sublabel: 'real-time card tracking', barPct: 95, accent: 'gold' },
    { value: '0', numericEnd: 200, suffix: 'K+', label: 'VERIFICATIONS / DAY', sublabel: 'automated KYC pipeline', barPct: 85, accent: 'gold' },
    { value: '0', numericEnd: 10, suffix: 'M', label: 'CONCURRENT USERS', sublabel: 'IPL 2025 peak load', barPct: 97, accent: 'green' },
    { value: '0', numericEnd: 99.95, suffix: '%', label: 'UPTIME SLA', sublabel: 'KYC platform reliability', barPct: 99, accent: 'gold' },
    { value: '0', numericEnd: 12, suffix: '+', label: 'AI AGENTS SHIPPED', sublabel: 'production LLM / RAG agents', barPct: 86, accent: 'gold' },
    { value: '0', numericEnd: 4.2, suffix: 'K', label: 'RAG QUERIES / SEC', sublabel: 'grounded retrieval throughput', barPct: 90, accent: 'green' },
    { value: '0', numericEnd: 3, suffix: '', label: 'ARTICLES PUBLISHED', sublabel: 'engineering deep-dives', barPct: 60, accent: 'gold' },
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
  }

  private animateCounters(): void {
    const duration = 1800;
    const fps = 60;
    const totalFrames = Math.round(duration / (1000 / fps));

    this.metrics.forEach((metric, idx) => {
      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        const progress = this.easeOutExpo(frame / totalFrames);
        const current = metric.numericEnd * progress;

        if (Number.isInteger(metric.numericEnd)) {
          this.displayValues[idx] = Math.round(current).toLocaleString();
        } else {
          this.displayValues[idx] = current.toFixed(current < 10 ? 2 : 1);
        }

        if (frame >= totalFrames) {
          clearInterval(interval);
          this.displayValues[idx] = Number.isInteger(metric.numericEnd)
            ? metric.numericEnd.toLocaleString()
            : metric.numericEnd.toString();
        }
      }, 1000 / fps);
    });
  }

  private easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
}
