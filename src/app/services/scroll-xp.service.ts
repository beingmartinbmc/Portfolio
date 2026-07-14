import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AchievementsService } from './achievements.service';

export interface LevelUpEvent {
  level: number;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class ScrollXpService implements OnDestroy {
  private readonly sections = [
    'about', 'avatar-3d', 'skill', 'experience', 'metrics', 'publications', 'blogs', 'ai-quiz-game', 'education', 'operating-style'
  ];
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
  private scrollHandler: (() => void) | null = null;

  readonly xp$ = new BehaviorSubject<number>(0);
  readonly level$ = new BehaviorSubject<{ level: number; title: string }>({ level: 1, title: 'Visitor' });
  readonly levelUp$ = new Subject<LevelUpEvent>();

  constructor(private achievements: AchievementsService) {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      // Use a very low threshold so even partially-visible sections count
      this.observer = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) this.onSectionView(e.target.id);
        }),
        { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
      );

      // Observe after DOM is ready
      setTimeout(() => this.observeSections(), 800);

      // Fallback: if user scrolls to the very bottom, grant 100%
      this.scrollHandler = () => this.checkBottomReached();
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  }

  private observeSections(): void {
    this.sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && this.observer) this.observer.observe(el);
    });
  }

  private onSectionView(id: string): void {
    if (!this.sections.includes(id) || this.viewedSections.has(id)) return;
    this.viewedSections.add(id);
    this.achievements.trackSectionView();
    this.recalcXp();
  }

  private checkBottomReached(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // If user is within 100px of the page bottom, grant full XP
    if (scrollTop + windowHeight >= docHeight - 100) {
      // Mark all sections as viewed
      this.sections.forEach(id => {
        if (!this.viewedSections.has(id)) {
          this.viewedSections.add(id);
          this.achievements.trackSectionView();
        }
      });
      this.recalcXp();
    }
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
      const info = this.levels[newLevel - 1] || this.levels[this.levels.length - 1];
      this.level$.next({ level: newLevel, title: info.title });
      this.levelUp$.next({ level: newLevel, title: info.title });
    }
  }

  private getLevelForXp(xp: number): number {
    let lvl = 1;
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (xp >= this.levels[i].threshold) { lvl = i + 1; break; }
    }
    return lvl;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
