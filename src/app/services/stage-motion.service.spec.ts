import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StageMotionService } from './stage-motion.service';

describe('StageMotionService', () => {
  let service: StageMotionService;
  let zone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StageMotionService);
    zone = TestBed.inject(NgZone);
    service.stop();
    document.documentElement.style.removeProperty('--spot-x');
    document.documentElement.classList.remove('is-scrolling', 'play-mode');
  });

  afterEach(() => {
    service.stop();
    document.querySelectorAll('.quest-card').forEach(node => node.remove());
  });

  it('points the stage light at the pointer and tilts the card under it', () => {
    service.start(zone);
    const card = document.createElement('div');
    card.className = 'quest-card';
    card.style.width = '200px';
    card.style.height = '100px';
    document.body.appendChild(card);

    card.dispatchEvent(new PointerEvent('pointermove', {
      clientX: 10,
      clientY: 10,
      pointerType: 'mouse',
      bubbles: true,
    }));

    expect(document.documentElement.style.getPropertyValue('--spot-x')).not.toBe('');
    expect(card.style.getPropertyValue('--ry')).not.toBe('');
    expect(card.style.getPropertyValue('--rx')).not.toBe('');
  });

  it('does nothing when the visitor prefers reduced motion', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    service.start(zone);
    document.dispatchEvent(new PointerEvent('pointermove', {
      clientX: 40,
      clientY: 40,
      pointerType: 'mouse',
      bubbles: true,
    }));
    expect(document.documentElement.style.getPropertyValue('--spot-x')).toBe('');
  });
});
