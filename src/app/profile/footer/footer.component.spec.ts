import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FooterComponent} from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the resume, cover letter and email', () => {
    const hrefs = Array.from(fixture.nativeElement.querySelectorAll('.footer-links a'))
      .map(a => (a as HTMLAnchorElement).getAttribute('href'));
    expect(hrefs).toContain(component.documentLinks.resume);
    expect(hrefs).toContain(component.documentLinks.coverLetter);
    expect(hrefs).toContain(`mailto:${component.contactLinks.email}`);
  });
});
