import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { ScrollXpService, LevelUpEvent } from './scroll-xp.service';
import { AchievementsService } from './achievements.service';

describe('ScrollXpService', () => {
  let service: ScrollXpService;
  let achievements: jasmine.SpyObj<AchievementsService>;

  beforeEach(() => {
    achievements = jasmine.createSpyObj<AchievementsService>('AchievementsService', ['trackSpeedRun']);
    TestBed.configureTestingModule({
      providers: [
        ScrollXpService,
        { provide: AchievementsService, useValue: achievements },
      ],
    });
    service = TestBed.inject(ScrollXpService);
  });

  afterEach(() => service.ngOnDestroy());

  // The 10 sections the service tracks; each is worth 10% XP.
  const SECTIONS = [
    'about', 'avatar-3d', 'skill', 'experience', 'metrics',
    'publications', 'blogs', 'ai-quiz-game', 'education', 'operating-style',
  ];

  const view = (id: string) => (service as any).onSectionView(id);

  it('starts at 0 XP and level 1 (Visitor)', () => {
    expect(snapshot(service.xp$)).toBe(0);
    expect(snapshot(service.level$)).toEqual({ level: 1, title: 'Visitor' });
  });

  it('awards 10% XP per unique section viewed', () => {
    view('about');
    expect(snapshot(service.xp$)).toBe(10);
    view('skill');
    expect(snapshot(service.xp$)).toBe(20);
  });

  it('ignores repeated views of the same section', () => {
    view('about');
    view('about');
    view('about');
    expect(snapshot(service.xp$)).toBe(10);
  });

  it('ignores sections it does not track', () => {
    view('not-a-real-section');
    expect(snapshot(service.xp$)).toBe(0);
  });

  it('never decreases XP', () => {
    SECTIONS.forEach(view); // 100%
    expect(snapshot(service.xp$)).toBe(100);
    view('about'); // already counted
    expect(snapshot(service.xp$)).toBe(100);
  });

  it('levels up and emits a LevelUpEvent at the 20% threshold (Explorer)', () => {
    const events: LevelUpEvent[] = [];
    service.levelUp$.subscribe(e => events.push(e));

    view('about'); // 10% -> still level 1
    expect(events.length).toBe(0);

    view('skill'); // 20% -> Explorer
    expect(snapshot(service.level$)).toEqual({ level: 2, title: 'Explorer' });
    expect(events).toEqual([{ level: 2, title: 'Explorer' }]);
  });

  it('reaches Resume Master (level 6) at 100% XP', () => {
    SECTIONS.forEach(view);
    expect(snapshot(service.xp$)).toBe(100);
    expect(snapshot(service.level$)).toEqual({ level: 6, title: 'Resume Master' });
  });

  it('tracks a speed run achievement once XP hits 100%', () => {
    SECTIONS.forEach(view);
    expect(achievements.trackSpeedRun).toHaveBeenCalledTimes(1);
  });

  it('does not call trackSpeedRun before reaching 100%', () => {
    view('about');
    view('skill');
    expect(achievements.trackSpeedRun).not.toHaveBeenCalled();
  });

  describe('getLevelForXp', () => {
    const levelFor = (xp: number) => (service as any).getLevelForXp(xp);

    it('maps XP values to the correct level boundaries', () => {
      expect(levelFor(0)).toBe(1);
      expect(levelFor(19)).toBe(1);
      expect(levelFor(20)).toBe(2);
      expect(levelFor(40)).toBe(3);
      expect(levelFor(60)).toBe(4);
      expect(levelFor(80)).toBe(5);
      expect(levelFor(100)).toBe(6);
    });
  });

  it('cleans up its observer and scroll handler on destroy', () => {
    const observer = (service as any).observer;
    const disconnectSpy = observer ? spyOn(observer, 'disconnect').and.callThrough() : null;
    const removeSpy = spyOn(window, 'removeEventListener').and.callThrough();

    service.ngOnDestroy();

    if (disconnectSpy) expect(disconnectSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('scroll', jasmine.any(Function));
  });

  function snapshot<T>(stream: { pipe: Function }): T {
    let value!: T;
    (stream as any).pipe(take(1)).subscribe((v: T) => (value = v));
    return value;
  }
});
