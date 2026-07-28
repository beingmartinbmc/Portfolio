import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'personal-portfolio-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('personal-portfolio-angular');
  });

  it('should render the profile component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-profile')).toBeTruthy();
  });

  it('toggles is-hidden-tab on document visibility changes and cleans up on destroy', () => {
    const visibility = { value: 'hidden' as DocumentVisibilityState };
    spyOnProperty(document, 'visibilityState', 'get').and.callFake(() => visibility.value);

    const fixture = TestBed.createComponent(AppComponent);

    document.dispatchEvent(new Event('visibilitychange'));
    expect(document.body.classList.contains('is-hidden-tab')).toBeTrue();

    visibility.value = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    expect(document.body.classList.contains('is-hidden-tab')).toBeFalse();

    fixture.destroy();
    visibility.value = 'hidden';
    document.dispatchEvent(new Event('visibilitychange'));
    expect(document.body.classList.contains('is-hidden-tab')).toBeFalse();
  });
});
