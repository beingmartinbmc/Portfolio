import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent implements OnInit {
  showFlagCounter = false;
  viewCount = 0;

  constructor() {
  }

  ngOnInit(): void {
    // Simulate view count (you can replace this with actual analytics)
    this.viewCount = Math.floor(Math.random() * 1000) + 500;
  }

  toggleFlagCounter(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('Toggle flag counter clicked, current state:', this.showFlagCounter);
    this.showFlagCounter = !this.showFlagCounter;
    console.log('New state:', this.showFlagCounter);
  }

  hideFlagCounter(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log('Hide flag counter clicked');
    this.showFlagCounter = false;
  }
}
