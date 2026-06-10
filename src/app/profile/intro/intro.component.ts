import {Component, OnDestroy} from '@angular/core';
import {DOCUMENT_LINKS, SOCIAL_LINKS} from '../../config/profile-links';
import {AchievementsService} from '../../services/achievements.service';

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
  readonly heroMetrics = [
    { value: '6+', label: 'years building backend platforms' },
    { value: '2.7K', label: 'RPS handled on production systems' },
    { value: '200K+', label: 'daily verifications automated' },
    { value: '10M', label: 'concurrent users supported' }
  ];

  readonly focusAreas = [
    {
      icon: '🤖',
      title: 'AI Agents & LLMs',
      tag: 'STAR MODE',
      description: 'Tool-calling agents and Slack bots — including an on-call bot that debugs across Splunk, GitHub, Confluence, Drive, and Slack.',
      color: 'gold'
    },
    {
      icon: '🔥',
      title: 'RAG & Gen AI in Production',
      tag: 'FIRE FLOWER',
      description: 'Retrieval pipelines, prompt and context work, evals, and guardrails — the stuff that keeps AI useful past the demo.',
      color: 'green'
    },
    {
      icon: '🍄',
      title: 'Backend Systems',
      tag: 'POWER-UP',
      description: 'Java, Kafka, Redis, APIs, and event-driven workflows — plus the messy operational edges that keep high-traffic systems up.',
      color: 'red'
    }
  ];

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
