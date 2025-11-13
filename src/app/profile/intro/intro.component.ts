import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  standalone: true
})
export class IntroComponent implements OnInit {
  showAchievements = false;
  showDocumentDropdown = false;

  constructor() {
  }

  ngOnInit(): void {
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
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdown.bind(this), { once: true });
      }, 0);
    }
  }

  private closeDropdown(): void {
    this.showDocumentDropdown = false;
  }
}
