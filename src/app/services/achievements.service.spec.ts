import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { AchievementsService, Achievement } from './achievements.service';

describe('AchievementsService', () => {
  const STORAGE_KEY = 'portfolio_achievements';
  const VISIT_KEY = 'portfolio_visited';

  const makeService = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(AchievementsService);
  };

  beforeEach(() => {
    localStorage.clear();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2024-06-10T12:00:00')); // noon, not night owl
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    localStorage.clear();
  });

  it('is created with all achievements locked on a first visit', () => {
    const service = makeService();
    expect(service.getTotalCount()).toBe(13);
    expect(service.getUnlockedCount()).toBe(0);
  });

  describe('unlock', () => {
    it('unlocks an achievement once and emits a toast', () => {
      const service = makeService();
      let toastFired = false;
      service.toast$.pipe(take(1)).subscribe(t => {
        toastFired = true;
        expect(t.achievement.id).toBe('resume_reader');
        expect(t.achievement.unlocked).toBeTrue();
      });

      expect(service.unlock('resume_reader')).toBeTrue();
      expect(toastFired).toBeTrue();
      expect(service.getUnlockedCount()).toBe(1);
    });

    it('is idempotent — a second unlock returns false and does not re-toast', () => {
      const service = makeService();
      let toastCount = 0;
      service.toast$.subscribe(() => toastCount++);

      expect(service.unlock('resume_reader')).toBeTrue();
      expect(service.unlock('resume_reader')).toBeFalse();
      expect(toastCount).toBe(1);
    });

    it('returns false for an unknown achievement id', () => {
      const service = makeService();
      expect(service.unlock('does_not_exist')).toBeFalse();
      expect(service.getUnlockedCount()).toBe(0);
    });

    it('stamps unlockedAt and exposes it through the achievements$ stream', () => {
      const service = makeService();
      service.unlock('resume_reader');
      const list = readStream(service);
      const unlocked = list.find(a => a.id === 'resume_reader')!;
      expect(unlocked.unlocked).toBeTrue();
      expect(unlocked.unlockedAt).toBe(Date.parse('2024-06-10T12:00:00'));
    });
  });

  describe('saved state validation', () => {
    it('restores valid values and ignores malformed persisted values', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        achievements: [
          { id: 'resume_reader', unlocked: true, unlockedAt: 123 },
          { id: 'skill_hunter', unlocked: 'yes', unlockedAt: 'invalid' },
          null,
        ],
        counters: { skillsExpanded: 4, aiQuestions: 'invalid', unknown: 99 },
      }));

      const service = makeService();

      expect(isUnlocked(service, 'resume_reader')).toBeTrue();
      expect(isUnlocked(service, 'skill_hunter')).toBeFalse();
      service.trackSkillExpand();
      expect(isUnlocked(service, 'skill_hunter')).toBeTrue();
      service.trackAiQuestion();
      expect(isUnlocked(service, 'ai_whisperer')).toBeFalse();
    });
  });

  describe('counter thresholds', () => {
    it('only unlocks Skill Hunter after 5 skill expansions', () => {
      const service = makeService();
      for (let i = 0; i < 4; i++) service.trackSkillExpand();
      expect(isUnlocked(service, 'skill_hunter')).toBeFalse();
      service.trackSkillExpand();
      expect(isUnlocked(service, 'skill_hunter')).toBeTrue();
    });

    it('only unlocks AI Whisperer after 3 questions', () => {
      const service = makeService();
      service.trackAiQuestion();
      service.trackAiQuestion();
      expect(isUnlocked(service, 'ai_whisperer')).toBeFalse();
      service.trackAiQuestion();
      expect(isUnlocked(service, 'ai_whisperer')).toBeTrue();
    });

    it('only unlocks Social Butterfly after 2 social clicks', () => {
      const service = makeService();
      service.trackSocialClick();
      expect(isUnlocked(service, 'social_butterfly')).toBeFalse();
      service.trackSocialClick();
      expect(isUnlocked(service, 'social_butterfly')).toBeTrue();
    });
  });

  describe('score and time gated achievements', () => {
    it('unlocks Arcade Champion only at 500+', () => {
      const service = makeService();
      service.trackGameScore(499);
      expect(isUnlocked(service, 'arcade_champion')).toBeFalse();
      service.trackGameScore(500);
      expect(isUnlocked(service, 'arcade_champion')).toBeTrue();
    });

    it('unlocks Speed Runner only within the first 30 seconds', () => {
      const service = makeService();
      jasmine.clock().tick(31_000);
      service.trackSpeedRun();
      expect(isUnlocked(service, 'speed_runner')).toBeFalse();
    });

    it('unlocks Speed Runner when triggered quickly', () => {
      const service = makeService();
      jasmine.clock().tick(5_000);
      service.trackSpeedRun();
      expect(isUnlocked(service, 'speed_runner')).toBeTrue();
    });

    it('unlocks Deep Diver after 3 minutes', () => {
      const service = makeService();
      expect(isUnlocked(service, 'deep_diver')).toBeFalse();
      jasmine.clock().tick(3 * 60 * 1000);
      expect(isUnlocked(service, 'deep_diver')).toBeTrue();
    });
  });

  describe('contextual unlocks at construction', () => {
    it('unlocks Welcome Back when a previous visit is recorded', () => {
      localStorage.setItem(VISIT_KEY, '123');
      const service = makeService();
      expect(isUnlocked(service, 'returner')).toBeTrue();
    });

    it('unlocks Night Owl between midnight and 5am', () => {
      jasmine.clock().mockDate(new Date('2024-06-10T02:30:00'));
      const service = makeService();
      expect(isUnlocked(service, 'night_owl')).toBeTrue();
    });
  });

  describe('persistence', () => {
    it('restores unlocked achievements from localStorage', () => {
      const first = makeService();
      first.unlock('resume_reader');
      first.trackSkillExpand();

      const reloaded = makeService();
      expect(isUnlocked(reloaded, 'resume_reader')).toBeTrue();
      // counter persisted: 4 more expansions should now cross the threshold
      for (let i = 0; i < 4; i++) reloaded.trackSkillExpand();
      expect(isUnlocked(reloaded, 'skill_hunter')).toBeTrue();
    });

    it('survives corrupted localStorage data without throwing', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json');
      expect(() => makeService()).not.toThrow();
    });
  });

  // helpers -------------------------------------------------------
  function readStream(service: AchievementsService): Achievement[] {
    let snapshot: Achievement[] = [];
    service.achievements$.pipe(take(1)).subscribe(a => (snapshot = a));
    return snapshot;
  }

  function isUnlocked(service: AchievementsService, id: string): boolean {
    return !!readStream(service).find(a => a.id === id)?.unlocked;
  }
});
