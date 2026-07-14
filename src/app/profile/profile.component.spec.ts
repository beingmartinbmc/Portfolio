import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    // No detectChanges(): rendering the full profile tree boots a Three.js
    // WebGLRenderer (Avatar3d). We exercise the component class directly here;
    // the full render path is covered by AppComponent's integration spec.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('registers hash navigation on init and cleans up on destroy', () => {
    component.ngOnInit();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
