import {Component, ChangeDetectionStrategy} from '@angular/core';
import {DOCUMENT_LINKS} from '../../config/profile-links';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class EducationComponent {
  readonly documentLinks = DOCUMENT_LINKS;
}
