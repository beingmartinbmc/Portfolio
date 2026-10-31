import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CONTACT_LINKS, DOCUMENT_LINKS, SOCIAL_LINKS } from '../../config/profile-links';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class FooterComponent {
  readonly documentLinks = DOCUMENT_LINKS;
  readonly contactLinks = CONTACT_LINKS;
  readonly socialLinks = SOCIAL_LINKS;
  readonly currentYear = new Date().getFullYear();
}
