import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AchievementsService } from './achievements.service';
import { PORTFOLIO_SECTION_IDS } from '../config/portfolio-sections';

export interface LevelUpEvent {
  level: number;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class ScrollXpService implements OnDestroy {
  private readonly sections = PORTFOLIO_SECTION_IDS;
  private readonly levels = [
    { threshold: 0, title: 'Visitor' },
    { threshold: 20, title: 'Explorer' },
    { threshold: 40, title: 'Adventurer' },
    { threshold: 60, title: 'Veteran' },
    { threshold: 80, title: 'Champion' },
    { threshold: 100, title: 'Resume Master' },
  ];

  private observer: IntersectionObserver | null = null;
  private viewedSections = new Set<string>();
  // Visitors begin at level 1 (Visitor), so treat that as the baseline and only
  // emit a level-up event when they actually climb above it.
  private lastLevel = 1;
  private bottomSentinel: HTMLElement | null = null;

  readonly xp$ = new BehaviorSubject<number>(0);
  readonly level$ = new BehaviorSubject<{ level: number; title: string }>({ level: 1, title: 'Visitor' });
  readonly levelUp$ = new Subject<LevelUpEvent>();

  constructor(private achievements: AchievementsService) {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      // Use a very low threshold so even partially-visible sections count
      this.observer = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (!e.isIntersecting) return;
          if (e.target.id === 'portfolio-end-sentinel') {
            this.markAllSectionsViewed();
          } else {
            this.onSectionView(e.target.id);
          }
        }),
        { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
      );

      // Observe after DOM is ready
      setTimeout(() => this.observeSections(), 800);

    }
  }

  private observeSections(): void {
    this.sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && this.observer) this.observer.observe(el);
    });

    // A sentinel avoids a permanent global scroll listener while preserving
    // the existing behavior of awarding full XP at the end of the page.
    this.bottomSentinel = document.createElement('span');
    this.bottomSentinel.id = 'portfolio-end-sentinel';
    this.bottomSentinel.setAttribute('aria-hidden', 'true');
    this.bottomSentinel.style.cssText = 'display:block;height:1px;pointer-events:none';
    document.body.appendChild(this.bottomSentinel);
    this.observer?.observe(this.bottomSentinel);
  }

  private onSectionView(id: string): void {
    if (!this.sections.includes(id) || this.viewedSections.has(id)) return;
    this.viewedSections.add(id);
    this.achievements.trackSectionView();
    this.recalcXp();
  }

  private markAllSectionsViewed(): void {
    this.sections.forEach(id => {
      if (!this.viewedSections.has(id)) {
        this.viewedSections.add(id);
        this.achievements.trackSectionView();
      }
    });
    this.recalcXp();
  }

  private recalcXp(): void {
    const pct = Math.round((this.viewedSections.size / this.sections.length) * 100);
    if (pct <= this.xp$.value) return; // only increase
    this.xp$.next(pct);

    // Speed Runner: reaching 100% within the first 30s of the visit
    if (pct >= 100) {
      this.achievements.trackSpeedRun();
    }

    // Check level up
    const newLevel = this.getLevelForXp(pct);
    if (newLevel > this.lastLevel) {
      this.lastLevel = newLevel;
      const info = this.levels[newLevel - 1] ?? this.levels[this.levels.length - 1];
      const title = info?.title ?? 'Visitor';
      this.level$.next({ level: newLevel, title });
      this.levelUp$.next({ level: newLevel, title });
    }
  }

  private getLevelForXp(xp: number): number {
    let lvl = 1;
    for (let i = this.levels.length - 1; i >= 0; i--) {
      const level = this.levels[i];
      if (level && xp >= level.threshold) { lvl = i + 1; break; }
    }
    return lvl;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.bottomSentinel?.remove();
    this.bottomSentinel = null;
  }
}
