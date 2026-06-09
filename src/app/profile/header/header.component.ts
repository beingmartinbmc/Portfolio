import {Component, HostListener, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScrollXpService} from '../../services/scroll-xp.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;

  xpPercent = 0;
  levelTitle = 'Visitor';
  levelNum = 1;

  private subs: Subscription[] = [];

  constructor(
    private scrollXp: ScrollXpService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.scrollXp.xp$.subscribe(xp => this.xpPercent = xp),
      this.scrollXp.level$.subscribe(l => { this.levelTitle = l.title; this.levelNum = l.level; }),
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 100;
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
