import {Component, OnDestroy} from '@angular/core';
import {SOCIAL_LINKS, DOCUMENT_LINKS} from '../../config/profile-links';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true
})
export class IntroComponent implements OnDestroy {
  showAchievements = false;
  showDocumentDropdown = false;

  readonly socialLinks = SOCIAL_LINKS;
  readonly documentLinks = DOCUMENT_LINKS;
  private boundCloseDropdown = this.closeDropdown.bind(this);

  constructor() {
  }

  ngOnDestroy(): void {
    // Ensure we remove any lingering global listener
    document.removeEventListener('click', this.boundCloseDropdown);
  }

  toggleAchievements(): void {
    this.showAchievements = !this.showAchievements;
  }

  toggleDocumentDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showDocumentDropdown = !this.showDocumentDropdown;

    // Close dropdown when clicking outside
    if (this.showDocumentDropdown) {
      // Remove any stale listener before adding a new one
      document.removeEventListener('click', this.boundCloseDropdown);
      setTimeout(() => {
        document.addEventListener('click', this.boundCloseDropdown, { once: true });
      }, 0);
    } else {
      document.removeEventListener('click', this.boundCloseDropdown);
    }
  }

  private closeDropdown(): void {
    this.showDocumentDropdown = false;
  }
}
