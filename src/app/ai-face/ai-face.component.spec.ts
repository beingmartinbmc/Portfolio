import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiFaceComponent } from './ai-face.component';

describe('AiFaceComponent', () => {
  let component: AiFaceComponent;
  let fixture: ComponentFixture<AiFaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiFaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
