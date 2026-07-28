import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ANALYTICS_LINKS } from '../../config/profile-links';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class FooterComponent {
  readonly analyticsLinks = ANALYTICS_LINKS;
  readonly currentYear = new Date().getFullYear();
}
