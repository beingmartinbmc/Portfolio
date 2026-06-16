import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';

import {ExperienceComponent} from './experience.component';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ExperienceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('computes a positive total experience', () => {
    expect(parseFloat(component.totalExperience)).toBeGreaterThan(0);
  });

  it('builds a non-empty timeline with the current role at the end', () => {
    expect(component.stops.length).toBeGreaterThan(0);
    // The data is reversed so Mario starts at the most recent (current) role.
    expect(component.stops[component.stops.length - 1].isCurrent).toBeTrue();
  });

  it('places Mario at the most recent stop initially', () => {
    expect(component.marioPosition).toBe(component.stops.length - 1);
  });

  it('selectStop activates a stop and selects its first role', () => {
    const stop = component.stops[0];
    component.selectStop(stop, 0);
    expect(component.activeStop).toBe(stop);
    expect(component.activeRole).toBe(stop.roles[0]);
    expect(component.isStopActive(stop)).toBeTrue();
  });

  it('selectStop toggles the active stop off when re-selected', () => {
    const stop = component.stops[0];
    component.selectStop(stop, 0);
    component.selectStop(stop, 0);
    expect(component.activeStop).toBeNull();
    expect(component.activeRole).toBeNull();
  });

  it('selectStop updates marioPosition to the chosen index', () => {
    const idx = component.stops.length - 1;
    component.selectStop(component.stops[idx], idx);
    expect(component.marioPosition).toBe(idx);
  });

  it('selectRole sets the active role', () => {
    const stop = component.stops[0];
    const role = stop.roles[0];
    component.selectRole(role);
    expect(component.activeRole).toBe(role);
  });

  it('getStopPeriod returns a single role period directly', () => {
    const single = component.stops.find(s => s.roles.length === 1);
    if (single) {
      expect(component.getStopPeriod(single)).toBe(single.roles[0].period);
    } else {
      expect(true).toBeTrue();
    }
  });

  it('getStopPeriod summarises multi-role companies into a range', () => {
    const multi = component.stops.find(s => s.roles.length > 1);
    if (multi) {
      const period = component.getStopPeriod(multi);
      expect(period).toContain(' - ');
    } else {
      expect(true).toBeTrue();
    }
  });

  it('clears the run timer on destroy without throwing', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('selecting a different stop triggers and then clears the running flag', fakeAsync(() => {
    // Force measurable positions so moveMarioTo animates.
    const track = document.createElement('div');
    const stopA = document.createElement('button');
    const stopB = document.createElement('button');
    spyOn(track, 'getBoundingClientRect').and.returnValue({ left: 0, width: 800 } as DOMRect);
    spyOn(stopB, 'getBoundingClientRect').and.returnValue({ left: 400, width: 40 } as DOMRect);

    (component as any).mapTrack = { nativeElement: track };
    (component as any).stopEls = {
      get: (i: number) => ({ nativeElement: i === 1 ? stopB : stopA }),
    };

    component.marioLeft = 0;
    (component as any).moveMarioTo(1, true);

    expect(component.marioRunning).toBeTrue();
    expect(component.marioLeft).toBe(420); // 400 + 40/2

    tick(1000);
    expect(component.marioRunning).toBeFalse();
  }));
});
