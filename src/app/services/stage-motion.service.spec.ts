import { NgZone } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StageMotionService } from './stage-motion.service';

describe('StageMotionService', () => {
  let service: StageMotionService;
  let zone: NgZone;
  let light: HTMLElement;
  let card: HTMLElement;

  const move = (target: EventTarget, pointerType = 'mouse'): void => {
    target.dispatchEvent(new PointerEvent('pointermove', { clientX: 10, clientY: 10, pointerType, bubbles: true }));
  };
  const tilt = (): string => card.style.transform;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StageMotionService);
    zone = TestBed.inject(NgZone);
    service.stop();
    document.documentElement.classList.remove('is-scrolling', 'play-mode');

    light = document.createElement('div');
    light.className = 'stage-light';
    card = document.createElement('div');
    card.className = 'quest-card';
    card.style.width = '200px';
    card.style.height = '100px';
    document.body.append(light, card);
  });

  afterEach(() => {
    service.stop();
    light.remove();
    card.remove();
  });

  it('points the stage light at the pointer and tilts the card under it', () => {
    service.start(zone);
    move(card);

    expect(light.style.getPropertyValue('--spot-x')).not.toBe('');
    expect(light.style.getPropertyValue('--spot-y')).not.toBe('');
    expect(tilt()).toContain('rotateY(');
    expect(tilt()).toContain('rotateX(');
  });

  it('keeps pointer vars off <html>, where an inherited change restyles the whole page', () => {
    service.start(zone);
    move(card);

    const root = document.documentElement.style;
    expect(root.getPropertyValue('--spot-x')).toBe('');
    expect(root.getPropertyValue('--scroll-y')).toBe('');
  });

  it('leaves a card at rest untransformed, so it is not promoted to a 3D layer until hovered', () => {
    service.start(zone);
    expect(getComputedStyle(card).transform).toBe('none'); // global styles are loaded in Karma
    move(card);
    expect(getComputedStyle(card).transform).not.toBe('none');
    move(document.body); // off every card
    expect(getComputedStyle(card).transform).toBe('none');
  });

  it('tilts harder in play mode', () => {
    service.start(zone);
    move(card);
    const calm = tilt();
    document.documentElement.classList.add('play-mode');
    move(card);
    expect(tilt()).not.toBe(calm);
  });

  it('moves the light for touch but never tilts', () => {
    service.start(zone);
    move(card, 'touch');

    expect(light.style.getPropertyValue('--spot-x')).not.toBe('');
    expect(tilt()).toBe('');
  });

  it('drops the tilt when the pointer leaves the window', () => {
    service.start(zone);
    move(card);
    expect(tilt()).not.toBe('');

    document.documentElement.dispatchEvent(new PointerEvent('pointerleave'));
    expect(tilt()).toBe('');
  });

  it('flags scrolling, then clears the flag once idle', fakeAsync(() => {
    service.start(zone);
    tick(16); // one animation frame
    expect(document.documentElement.classList.contains('is-scrolling')).toBeTrue();

    tick(140); // the idle window
    expect(document.documentElement.classList.contains('is-scrolling')).toBeFalse();
  }));

  it('does nothing when the visitor prefers reduced motion', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    service.start(zone);
    move(card);

    expect(light.style.getPropertyValue('--spot-x')).toBe('');
    expect(tilt()).toBe('');
  });
});
