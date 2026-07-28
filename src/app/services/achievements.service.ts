import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface AchievementToast {
  achievement: Achievement;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class AchievementsService {
  private readonly STORAGE_KEY = 'portfolio_achievements';

  private achievements: Achievement[] = [
    { id: 'explorer', title: 'Explorer', description: 'Viewed all sections', icon: '🏆', unlocked: false },
    { id: 'skill_hunter', title: 'Skill Hunter', description: 'Expanded 5 skill cards', icon: '🎯', unlocked: false },
    { id: 'ai_whisperer', title: 'AI Whisperer', description: 'Asked the avatar 3 questions', icon: '🗣️', unlocked: false },
    { id: 'arcade_champion', title: 'Arcade Champion', description: 'Scored 500+ in the game', icon: '🎮', unlocked: false },
    { id: 'lore_master', title: 'Lore Master', description: 'Clicked all blog posts', icon: '📜', unlocked: false },
    { id: 'code_breaker', title: 'Code Breaker', description: 'Entered the Konami code', icon: '🌟', unlocked: false },
    { id: 'resume_reader', title: 'Resume Reader', description: 'Downloaded the resume', icon: '📄', unlocked: false },
    { id: 'time_traveler', title: 'Time Traveler', description: 'Visited all experience stops', icon: '⏳', unlocked: false },
    { id: 'speed_runner', title: 'Speed Runner', description: 'Scrolled to bottom in under 30s', icon: '🏃', unlocked: false },
    { id: 'returner', title: 'Welcome Back', description: 'Visited the portfolio again', icon: '👋', unlocked: false },
    { id: 'deep_diver', title: 'Deep Diver', description: 'Spent 3+ minutes exploring', icon: '🤿', unlocked: false },
    { id: 'night_owl', title: 'Night Owl', description: 'Visited between midnight and 5am', icon: '🦉', unlocked: false },
    { id: 'social_butterfly', title: 'Social Butterfly', description: 'Clicked 2+ social links', icon: '🦋', unlocked: false },
  ];

  private counters: Record<string, number> = {
    skillsExpanded: 0,
    aiQuestions: 0,
    blogsClicked: 0,
    experienceStops: 0,
    sectionsViewed: 0,
    socialClicks: 0,
  };

  private readonly startTime = Date.now();
  private deepDiverTimer: ReturnType<typeof setTimeout> | null = null;

  readonly achievements$ = new BehaviorSubject<Achievement[]>([]);
  readonly toast$ = new Subject<AchievementToast>();

  constructor() {
    this.loadFromStorage();
    this.achievements$.next([...this.achievements]);
    this.checkReturnVisit();
    this.checkNightOwl();
    this.startDeepDiverTimer();
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const saved: unknown = JSON.parse(data);
        const root = typeof saved === 'object' && saved !== null ? saved as Record<string, unknown> : null;
        const savedAchievements = root?.['achievements'];
        if (Array.isArray(savedAchievements)) {
          for (const entry of savedAchievements) {
            if (typeof entry !== 'object' || entry === null) { continue; }
            const s = entry as Record<string, unknown>;
            const a = this.achievements.find(x => x.id === s['id']);
            if (!a) { continue; }
            a.unlocked = s['unlocked'] === true;
            a.unlockedAt = typeof s['unlockedAt'] === 'number' ? s['unlockedAt'] : undefined;
          }
        }
        const savedCounters = root?.['counters'];
        if (typeof savedCounters === 'object' && savedCounters !== null) {
          for (const [key, value] of Object.entries(savedCounters)) {
            if (key in this.counters && typeof value === 'number' && Number.isFinite(value)) {
              this.counters[key] = value;
            }
          }
        }
      }
    } catch { /* ignore */ }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        achievements: this.achievements.map(a => ({ id: a.id, unlocked: a.unlocked, unlockedAt: a.unlockedAt })),
        counters: this.counters,
      }));
    } catch { /* ignore */ }
  }

  private checkReturnVisit(): void {
    const visitKey = 'portfolio_visited';
    if (localStorage.getItem(visitKey)) {
      this.unlock('returner');
    }
    localStorage.setItem(visitKey, Date.now().toString());
  }

  private checkNightOwl(): void {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      this.unlock('night_owl');
    }
  }

  private startDeepDiverTimer(): void {
    // Unlock after 3 minutes of page engagement
    this.deepDiverTimer = setTimeout(() => {
      this.unlock('deep_diver');
    }, 3 * 60 * 1000);
  }

  unlock(id: string): boolean {
    const achievement = this.achievements.find(a => a.id === id);
    if (!achievement || achievement.unlocked) return false;

    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    this.achievements$.next([...this.achievements]);
    this.toast$.next({ achievement, timestamp: Date.now() });
    this.saveToStorage();
    return true;
  }

  increment(counter: string, threshold?: { count: number; achievementId: string }): void {
    this.counters[counter] = (this.counters[counter] || 0) + 1;
    if (threshold && this.counters[counter] >= threshold.count) {
      this.unlock(threshold.achievementId);
    }
    this.saveToStorage();
  }

  trackSectionView(): void {
    this.increment('sectionsViewed', { count: 8, achievementId: 'explorer' });
  }

  trackSkillExpand(): void {
    this.increment('skillsExpanded', { count: 5, achievementId: 'skill_hunter' });
  }

  trackAiQuestion(): void {
    this.increment('aiQuestions', { count: 3, achievementId: 'ai_whisperer' });
  }

  trackBlogClick(): void {
    this.increment('blogsClicked', { count: 3, achievementId: 'lore_master' });
  }

  trackExperienceStop(): void {
    this.increment('experienceStops', { count: 4, achievementId: 'time_traveler' });
  }

  trackGameScore(score: number): void {
    if (score >= 500) this.unlock('arcade_champion');
  }

  trackResumeDownload(): void {
    this.unlock('resume_reader');
  }

  trackSocialClick(): void {
    this.increment('socialClicks', { count: 2, achievementId: 'social_butterfly' });
  }

  trackSpeedRun(): void {
    const elapsed = Date.now() - this.startTime;
    if (elapsed <= 30_000) {
      this.unlock('speed_runner');
    }
  }

  getUnlockedCount(): number {
    return this.achievements.filter(a => a.unlocked).length;
  }

  getTotalCount(): number {
    return this.achievements.length;
  }
}
