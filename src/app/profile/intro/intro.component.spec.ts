import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

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

  it('toggleDocumentDropdown opens the dropdown and registers an outside-click closer', fakeAsync(() => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    const addSpy = spyOn(document, 'addEventListener').and.callThrough();

    component.toggleDocumentDropdown(event);
    expect(component.showDocumentDropdown).toBeTrue();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();

    tick(0);
    expect(addSpy).toHaveBeenCalledWith('click', jasmine.any(Function), { once: true });
  }));

  it('toggleDocumentDropdown closes when toggled again', () => {
    const event = new MouseEvent('click');
    component.showDocumentDropdown = true;
    const removeSpy = spyOn(document, 'removeEventListener').and.callThrough();
    component.toggleDocumentDropdown(event);
    expect(component.showDocumentDropdown).toBeFalse();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('scrollToOperatingStyle scrolls to the operating-style section', fakeAsync(() => {
    const section = document.createElement('div');
    section.id = 'operating-style';
    document.body.appendChild(section);
    const scrollSpy = spyOn(section, 'scrollIntoView');
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');

    component.scrollToOperatingStyle(event);
    tick(0);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    document.body.removeChild(section);
  }));

  it('trackResumeDownload delegates to the achievements service', () => {
    component.trackResumeDownload();
    expect(achievements.trackResumeDownload).toHaveBeenCalled();
  });

  it('trackSocialClick delegates to the achievements service', () => {
    component.trackSocialClick();
    expect(achievements.trackSocialClick).toHaveBeenCalled();
  });

  it('cleans up the document click listener on destroy', () => {
    const removeSpy = spyOn(document, 'removeEventListener').and.callThrough();
    component.ngOnDestroy();
    expect(removeSpy).toHaveBeenCalledWith('click', jasmine.any(Function));
  });
});
