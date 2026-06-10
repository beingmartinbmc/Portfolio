import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  const STORAGE_KEY = 'portfolio_sfx_enabled';

  const makeService = () => {
    TestBed.configureTestingModule({});
    return TestBed.inject(AudioService);
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('defaults to disabled when no preference is stored', () => {
    const service = makeService();
    expect(service.enabled).toBeFalse();
    expect(latest(service)).toBeFalse();
  });

  it('restores the enabled preference from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    expect(makeService().enabled).toBeTrue();
  });

  it('toggles state and persists the new value', () => {
    const service = makeService();
    service.toggle();
    expect(service.enabled).toBeTrue();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');

    service.toggle();
    expect(service.enabled).toBeFalse();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('false');
  });

  it('emits the toggled state through enabled$', () => {
    const service = makeService();
    const emissions: boolean[] = [];
    service.enabled$.subscribe(v => emissions.push(v));
    service.toggle();
    service.toggle();
    expect(emissions).toEqual([false, true, false]);
  });

  it('does nothing audible and never throws when disabled', () => {
    const service = makeService();
    expect(service.enabled).toBeFalse();
    expect(() => {
      service.play('coin');
      service.play('levelUp');
      service.play('click');
    }).not.toThrow();
  });

  it('plays sound effects without throwing once enabled', () => {
    const service = makeService();
    service.toggle(); // enables + plays a click
    expect(() => {
      (['coin', 'levelUp', 'powerUp', 'pipe', 'jump', 'star', 'click'] as const)
        .forEach(name => service.play(name));
    }).not.toThrow();
  });

  function latest(service: AudioService): boolean {
    let v = false;
    service.enabled$.pipe(take(1)).subscribe(x => (v = x));
    return v;
  }
});
