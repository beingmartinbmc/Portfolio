import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FIT_CARDS,
  COLLABORATION_TRACKS,
  FIRST_WEEK_OUTCOMES,
  OPERATING_PRINCIPLES,
  EMPHASIS_AREAS
} from './contact.data';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ContactComponent {
  selectedCard = 0;

  readonly fitCards = FIT_CARDS;
  readonly collaborationTracks = COLLABORATION_TRACKS;
  readonly firstWeekOutcomes = FIRST_WEEK_OUTCOMES;
  readonly operatingPrinciples = OPERATING_PRINCIPLES;
  readonly emphasisAreas = EMPHASIS_AREAS;
}
