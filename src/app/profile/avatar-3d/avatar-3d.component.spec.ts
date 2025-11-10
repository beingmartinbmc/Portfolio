import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Avatar3dComponent } from './avatar-3d.component';

describe('Avatar3dComponent', () => {
  let component: Avatar3dComponent;
  let fixture: ComponentFixture<Avatar3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar3dComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Avatar3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
