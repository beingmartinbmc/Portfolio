import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
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

  describe('current-section highlight', () => {
    const sections: HTMLElement[] = [];
    const place = (id: string, top: number): void => {
      const el = document.createElement('div');
      el.id = id;
      spyOn(el, 'getBoundingClientRect').and.returnValue({ top } as DOMRect);
      document.body.appendChild(el);
      sections.push(el);
    };
    const current = (): string[] =>
      Array.from(fixture.nativeElement.querySelectorAll('.nav-link.is-current'))
        .map(a => (a as HTMLElement).getAttribute('href') ?? '');

    beforeEach(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true });
      // viewport-relative tops: About and Work are behind us, Impact (no nav link) is at the header, Projects is below.
      place('about', -900);
      place('experience', -300);
      place('metrics', 60);
      place('publications', 900);
    });

    afterEach(() => {
      sections.splice(0).forEach(el => el.remove());
    });

    it('lights the link of the section under the header, and keeps it through a section with no link', () => {
      component.onWindowScroll();
      fixture.detectChanges();

      expect(component.activeSection).toBe('experience');
      expect(current()).toEqual(['#experience']);
      expect(fixture.nativeElement.querySelector('a[href="#experience"]').getAttribute('aria-current')).toBe('true');
      expect(fixture.nativeElement.querySelector('a[href="#about"]').hasAttribute('aria-current')).toBeFalse();
    });

    it('lets a nav click own the highlight until its scroll settles, then re-reads the page', fakeAsync(() => {
      // The page reads as Work, but the user clicked Game, a deferred section that grew after the jump landed.
      component.onNavLinkClick(new MouseEvent('click'), 'ai-quiz-game');
      tick(0);
      expect(component.activeSection).toBe('ai-quiz-game');

      tick(100);
      component.onWindowScroll(); // the jump's own scroll events must not undo the click
      expect(component.activeSection).toBe('ai-quiz-game');

      tick(200); // scroll goes quiet
      component.onWindowScroll(); // the next scroll reads the page again
      expect(component.activeSection).toBe('experience');
    }));

    it('lights nothing before the first section reaches the header', () => {
      sections.forEach(el => (el.getBoundingClientRect as jasmine.Spy).and.returnValue({ top: 500 } as DOMRect));
      component.onWindowScroll();
      fixture.detectChanges();

      expect(component.activeSection).toBe('');
      expect(current()).toEqual([]);
    });
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
    tick(150); // the click also starts the 150ms highlight hold

    expect(preventSpy).toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    document.body.removeChild(section);
  }));

  it('onNavLinkClick with no section scrolls to top', fakeAsync(() => {
    const scrollSpy = spyOn(window, 'scrollTo');
    component.onNavLinkClick();
    tick(150); // the click also starts the 150ms highlight hold
    // window.scrollTo is overloaded ((x,y) | (options)); inspect the args
    // directly to avoid TS resolving to the wrong overload signature.
    expect(scrollSpy).toHaveBeenCalled();
    expect(scrollSpy.calls.mostRecent().args[0] as any).toEqual({ top: 0 });
  }));

  it('onNavLinkClick closes an open menu first', fakeAsync(() => {
    component.isMenuOpen = true;
    const closeSpy = spyOn(component, 'closeMenu').and.callThrough();
    component.onNavLinkClick(undefined, undefined);
    tick(150); // the click also starts the 150ms highlight hold
    expect(closeSpy).toHaveBeenCalled();
  }));

  it('opens the code world from the brace mark', () => {
    fixture.nativeElement.querySelector('.brand-mark').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.code-world')).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('unsubscribes on destroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
