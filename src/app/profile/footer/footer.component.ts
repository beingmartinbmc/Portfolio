import { Component, OnInit } from '@angular/core';
import { ANALYTICS_LINKS } from '../../config/profile-links';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: []
})
export class FooterComponent implements OnInit {
  readonly analyticsLinks = ANALYTICS_LINKS;
  readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.incrementFlagCounter();
  }

  private incrementFlagCounter(): void {
    // Load the flag counter image to increment the counter
    const img = new Image();
    img.src = ANALYTICS_LINKS.flagCounterPixel;
  }
}
