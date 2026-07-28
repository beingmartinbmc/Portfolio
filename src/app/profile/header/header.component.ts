import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollXpService} from '../../services/scroll-xp.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;

  xpPercent = 0;
  levelTitle = 'Visitor';
  levelNum = 1;

  private subs: Subscription[] = [];
  private scrollFrame: number | null = null;
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
    this.subs.forEach(s => s.unsubscribe());
  }

  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrolled = scrollPosition > 100;
    if (scrolled === this.isScrolled) return;
    this.isScrolled = scrolled;
    this.cdr.markForCheck();
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

    window.setTimeout(() => {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({behavior: 'smooth', block: 'start'});
        return;
      }

      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 0);
  }
}
