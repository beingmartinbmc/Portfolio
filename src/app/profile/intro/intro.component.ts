import {Component, OnDestroy} from '@angular/core';
import {DOCUMENT_LINKS, SOCIAL_LINKS} from '../../config/profile-links';
import {AchievementsService} from '../../services/achievements.service';
import {HERO_METRICS, FOCUS_AREAS} from './intro.data';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true
})
export class IntroComponent implements OnDestroy {
  showDocumentDropdown = false;

  readonly socialLinks = SOCIAL_LINKS;
  readonly documentLinks = DOCUMENT_LINKS;
  readonly heroMetrics = HERO_METRICS;
  readonly focusAreas = FOCUS_AREAS;

  private boundCloseDropdown = this.closeDropdown.bind(this);

  constructor(private achievements: AchievementsService) {}

  ngOnDestroy(): void {
    document.removeEventListener('click', this.boundCloseDropdown);
  }

  toggleDocumentDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showDocumentDropdown = !this.showDocumentDropdown;

    if (this.showDocumentDropdown) {
      document.removeEventListener('click', this.boundCloseDropdown);
      setTimeout(() => {
        document.addEventListener('click', this.boundCloseDropdown, { once: true });
      }, 0);
    } else {
      document.removeEventListener('click', this.boundCloseDropdown);
    }
  }

  scrollToOperatingStyle(event: Event): void {
    event.preventDefault();
    window.setTimeout(() => {
      document.getElementById('operating-style')?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 0);
  }

  trackResumeDownload(): void {
    this.achievements.trackResumeDownload();
  }

  trackSocialClick(): void {
    this.achievements.trackSocialClick();
  }

  private closeDropdown(): void {
    this.showDocumentDropdown = false;
  }
}
