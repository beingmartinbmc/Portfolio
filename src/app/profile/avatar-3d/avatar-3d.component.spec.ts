import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avatar3dComponent } from './avatar-3d.component';

describe('Avatar3dComponent', () => {
  let component: Avatar3dComponent;
  let fixture: ComponentFixture<Avatar3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar3dComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('degrades gracefully when WebGL is unavailable (headless CI)', () => {
    // No real GPU in CI: the component should flag WebGL as unavailable and
    // stop showing the loading state rather than throwing on renderer init.
    expect(component.webglAvailable).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('cleans up timers/listeners on destroy even if the 3D scene never booted', () => {
    const removeSpy = spyOn(window, 'removeEventListener').and.callThrough();
    expect(() => component.ngOnDestroy()).not.toThrow();
    expect(removeSpy).toHaveBeenCalledWith('resize', jasmine.any(Function));
  });
});
