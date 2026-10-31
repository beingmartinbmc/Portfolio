import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IntroComponent } from './intro.component';
import { AchievementsService } from '../../services/achievements.service';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;
  let achievements: jasmine.SpyObj<AchievementsService>;

  beforeEach(waitForAsync(() => {
    achievements = jasmine.createSpyObj('AchievementsService', [
      'trackResumeDownload',
      'trackSocialClick',
    ]);

    TestBed.configureTestingModule({
      imports: [IntroComponent],
      providers: [{ provide: AchievementsService, useValue: achievements }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create with hero metrics and focus areas', () => {
    expect(component).toBeTruthy();
    expect(component.heroMetrics.length).toBe(4);
    expect(component.focusAreas.length).toBe(3);
    expect(component.socialLinks).toBeTruthy();
    expect(component.documentLinks).toBeTruthy();
  });

  it('links the hero actions straight to the resume and email', () => {
    const actions: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('.hero-actions a'));
    expect(actions.map(a => a.getAttribute('href'))).toEqual([
      component.documentLinks.resume,
      `mailto:${component.contactLinks.email}`,
    ]);
    actions[0]!.dispatchEvent(new MouseEvent('click', { cancelable: true }));
    expect(achievements.trackResumeDownload).toHaveBeenCalled();
  });

  it('trackResumeDownload delegates to the achievements service', () => {
    component.trackResumeDownload();
    expect(achievements.trackResumeDownload).toHaveBeenCalled();
  });

  it('trackSocialClick delegates to the achievements service', () => {
    component.trackSocialClick();
    expect(achievements.trackSocialClick).toHaveBeenCalled();
  });
});
