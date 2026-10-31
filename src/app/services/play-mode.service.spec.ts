import { TestBed } from '@angular/core/testing';
import { PlayModeService } from './play-mode.service';

describe('PlayModeService', () => {
  const create = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(PlayModeService);
  };

  afterEach(() => {
    localStorage.removeItem('portfolio_play_mode');
    document.documentElement.classList.remove('play-mode');
  });

  it('defaults to the professional view', () => {
    localStorage.removeItem('portfolio_play_mode');
    const service = create();
    expect(service.enabled()).toBeFalse();
    expect(document.documentElement.classList).not.toContain('play-mode');
  });

  it('toggles the html class and persists the choice', () => {
    const service = create();
    service.toggle();
    expect(service.enabled()).toBeTrue();
    expect(document.documentElement.classList).toContain('play-mode');
    expect(localStorage.getItem('portfolio_play_mode')).toBe('true');
    expect(create().enabled()).toBeTrue();
  });

  it('still works when storage is blocked', () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('blocked');
    spyOn(Storage.prototype, 'setItem').and.throwError('blocked');
    const service = create();
    expect(service.enabled()).toBeFalse();
    expect(() => service.toggle()).not.toThrow();
    expect(service.enabled()).toBeTrue();
  });
});
