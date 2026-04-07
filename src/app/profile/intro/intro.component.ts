import {Component, OnDestroy} from '@angular/core';
import {DOCUMENT_LINKS, SOCIAL_LINKS} from '../../config/profile-links';

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
      icon: '🍄',
      title: 'Backend Systems',
      tag: 'POWER-UP',
      description: 'Java, Kafka, Redis, APIs, event-driven workflows, and the operational edges that make systems reliable.',
      color: 'red'
    },
    {
      icon: '⭐',
      title: 'Staff-Level Execution',
      tag: 'STAR MODE',
      description: 'Shaping architecture, unblocking teams, and turning ambiguous product goals into durable technical plans.',
      color: 'gold'
    },
    {
      icon: '🔥',
      title: 'Gen AI in Production',
      tag: 'FIRE FLOWER',
      description: 'Voice interfaces, prompt workflows, AI copilots, and product experiences that have to work outside the demo.',
      color: 'green'
    }
  ];

  private boundCloseDropdown = this.closeDropdown.bind(this);

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

  private closeDropdown(): void {
    this.showDocumentDropdown = false;
  }
}
