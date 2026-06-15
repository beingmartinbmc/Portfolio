import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { KonamiComponent } from './konami.component';
import { AchievementsService } from '../../services/achievements.service';
import { AudioService } from '../../services/audio.service';

describe('KonamiComponent', () => {
  let component: KonamiComponent;
  let fixture: ComponentFixture<KonamiComponent>;
  let achievements: jasmine.SpyObj<AchievementsService>;
  let audio: jasmine.SpyObj<AudioService>;

  const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  beforeEach(async () => {
    achievements = jasmine.createSpyObj('AchievementsService', ['unlock']);
    audio = jasmine.createSpyObj('AudioService', ['play']);

    await TestBed.configureTestingModule({
      imports: [KonamiComponent],
      providers: [
        { provide: AchievementsService, useValue: achievements },
        { provide: AudioService, useValue: audio },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KonamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    document.body.classList.remove('god-mode');
  });

  function type(keys: string[]): void {
    keys.forEach(key => component.onKeydown(new KeyboardEvent('keydown', { key })));
  }

  it('should create with god mode off', () => {
    expect(component).toBeTruthy();
    expect(component.godMode).toBeFalse();
  });

  it('activates god mode on the full Konami code', () => {
    type(CODE);
    expect(component.godMode).toBeTrue();
    expect(audio.play).toHaveBeenCalledWith('star');
    expect(achievements.unlock).toHaveBeenCalledWith('code_breaker');
    expect(document.body.classList.contains('god-mode')).toBeTrue();
  });

  it('does not activate on a wrong sequence', () => {
    type(['ArrowUp', 'ArrowUp', 'b', 'a']);
    expect(component.godMode).toBeFalse();
    expect(achievements.unlock).not.toHaveBeenCalled();
  });

  it('still activates when preceded by extra keystrokes (rolling window)', () => {
    type(['x', 'y', 'z', ...CODE]);
    expect(component.godMode).toBeTrue();
  });

  it('deactivates god mode after the 10s timeout', fakeAsync(() => {
    type(CODE);
    expect(component.godMode).toBeTrue();
    tick(10000);
    expect(component.godMode).toBeFalse();
    expect(document.body.classList.contains('god-mode')).toBeFalse();
  }));

  it('clears the timer and god-mode class on destroy', fakeAsync(() => {
    type(CODE);
    component.ngOnDestroy();
    expect(document.body.classList.contains('god-mode')).toBeFalse();
    tick(10000);
  }));
});
