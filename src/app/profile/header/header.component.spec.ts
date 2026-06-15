import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.detectChanges();
  });

  afterEach(() => {
    // Ensure body styles never leak between tests.
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.classList.remove('menu-open');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('subscribes to scroll-xp streams on init', () => {
    expect(component.xpPercent).toBeGreaterThanOrEqual(0);
    expect(component.levelTitle).toBeTruthy();
    expect(component.levelNum).toBeGreaterThanOrEqual(1);
  });

  it('marks scrolled state past the 100px threshold', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 250, configurable: true });
    component.onWindowScroll();
    expect(component.isScrolled).toBeTrue();

    Object.defineProperty(window, 'pageYOffset', { value: 10, configurable: true });
    component.onWindowScroll();
    expect(component.isScrolled).toBeFalse();
  });

  it('toggleMenu locks and unlocks body scroll', () => {
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.classList.contains('menu-open')).toBeTrue();

    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
    expect(document.body.style.overflow).toBe('');
    expect(document.body.classList.contains('menu-open')).toBeFalse();
  });

  it('closeMenu restores body state and scroll position', () => {
    component.toggleMenu(); // open, sets body.top
    document.body.style.top = '-300px';
    const scrollSpy = spyOn(window, 'scrollTo');
    component.closeMenu();
    expect(component.isMenuOpen).toBeFalse();
    expect(scrollSpy).toHaveBeenCalledWith(0, 300);
  });

  it('onNavLinkClick scrolls to a target section', fakeAsync(() => {
    const section = document.createElement('div');
    section.id = 'about';
    document.body.appendChild(section);
    const scrollIntoView = spyOn(section, 'scrollIntoView');
    const event = new MouseEvent('click');
    const preventSpy = spyOn(event, 'preventDefault');

    component.onNavLinkClick(event, 'about');
    tick(0);

    expect(preventSpy).toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    document.body.removeChild(section);
  }));

  it('onNavLinkClick with no section scrolls to top', fakeAsync(() => {
    const scrollSpy = spyOn(window, 'scrollTo');
    component.onNavLinkClick();
    tick(0);
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  }));

  it('onNavLinkClick closes an open menu first', fakeAsync(() => {
    component.isMenuOpen = true;
    const closeSpy = spyOn(component, 'closeMenu').and.callThrough();
    component.onNavLinkClick(undefined, undefined);
    tick(0);
    expect(closeSpy).toHaveBeenCalled();
  }));

  it('unsubscribes on destroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
