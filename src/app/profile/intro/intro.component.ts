import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CONTACT_LINKS, DOCUMENT_LINKS, SOCIAL_LINKS} from '../../config/profile-links';
import {AchievementsService} from '../../services/achievements.service';
import {HERO_METRICS, FOCUS_AREAS} from './intro.data';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class IntroComponent {
  readonly socialLinks = SOCIAL_LINKS;
  readonly documentLinks = DOCUMENT_LINKS;
  readonly contactLinks = CONTACT_LINKS;
  readonly heroMetrics = HERO_METRICS;
  readonly focusAreas = FOCUS_AREAS;

  constructor(private achievements: AchievementsService) {}

  trackResumeDownload(): void {
    this.achievements.trackResumeDownload();
  }

  trackSocialClick(): void {
    this.achievements.trackSocialClick();
  }
}
