import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollXpService} from '../../services/scroll-xp.service';
import {PlayModeService} from '../../services/play-mode.service';
import {CodeWorldComponent} from '../code-world/code-world.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CodeWorldComponent]
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** In page order. Impact and Education have no link, so the nearest link above them stays lit. */
  readonly navLinks = [
    {id: 'about', label: 'About'},
    {id: 'experience', label: 'Work'},
    {id: 'publications', label: 'Projects'},
    {id: 'skill', label: 'Skills'},
    {id: 'blogs', label: 'Writing'},
    {id: 'avatar-3d', label: 'AI Twin'},
    {id: 'operating-style', label: 'Approach'},
    {id: 'ai-quiz-game', label: 'Game'},
  ] as const;

  readonly playMode = inject(PlayModeService);
  isScrolled = false;
  isMenuOpen = false;
  codeWorldOpen = false;

  xpPercent = 0;
  levelTitle = 'Visitor';
  levelNum = 1;
  activeSection = '';

  private subs: Subscription[] = [];
  private scrollFrame: number | null = null;
  private holdTimer: ReturnType<typeof setTimeout> | null = null;
  private holding = false;
  private readonly scrollHandler = () => {
    if (this.scrollFrame !== null) return;
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = null;
      this.onWindowScroll();
    });
  };

  constructor(
    private scrollXp: ScrollXpService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    this.onWindowScroll();
    this.subs.push(
      this.scrollXp.xp$.subscribe(xp => { this.xpPercent = xp; this.cdr.markForCheck(); }),
      this.scrollXp.level$.subscribe(l => {
        this.levelTitle = l.title;
        this.levelNum = l.level;
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    if (this.scrollFrame !== null) cancelAnimationFrame(this.scrollFrame);
    if (this.holdTimer) clearTimeout(this.holdTimer);
    this.subs.forEach(s => s.unsubscribe());
  }

  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrolled = scrollPosition > 100;
    const section = this.holding ? this.activeSection : this.sectionAt(scrollPosition);
    if (this.holding) this.holdUntilIdle();
    if (scrolled === this.isScrolled && section === this.activeSection) return;
    this.isScrolled = scrolled;
    this.activeSection = section;
    this.cdr.markForCheck();
  }

  /**
   * A nav click owns the highlight until its scroll settles. A deferred section (the quiz) can grow the page
   * after the jump lands, stranding the target below the marker; the next scroll after the hold re-reads the page.
   */
  private holdUntilIdle(): void {
    this.holding = true;
    if (this.holdTimer) clearTimeout(this.holdTimer);
    this.holdTimer = setTimeout(() => {
      this.holding = false;
      this.holdTimer = null;
    }, 150);
  }

  private sectionAt(scrollPosition: number): string {
    const marker = scrollPosition + 140;
    let current = '';
    for (const {id} of this.navLinks) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + (window.scrollY || scrollPosition);
      if (top <= marker) current = id;
    }
    return current;
  }

  openCodeWorld(): void {
    if (this.isMenuOpen) this.closeMenu();
    this.codeWorldOpen = true;
    document.body.style.overflow = 'hidden';
    this.cdr.markForCheck();
  }

  closeCodeWorld(): void {
    this.codeWorldOpen = false;
    document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  visitRealm(id: string): void {
    this.closeCodeWorld();
    this.onNavLinkClick(undefined, id === 'top' ? undefined : id);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.classList.add('menu-open');
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.classList.remove('menu-open');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.classList.remove('menu-open');
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  onNavLinkClick(event?: Event, sectionId?: string) {
    event?.preventDefault();
    if (this.isMenuOpen) {
      this.closeMenu();
    }

    this.activeSection = sectionId ?? '';
    this.holdUntilIdle();
    this.cdr.markForCheck();

    window.setTimeout(() => {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({block: 'start'});
        return;
      }

      window.scrollTo({top: 0});
    }, 0);
  }
}
