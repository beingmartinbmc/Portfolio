import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ContactComponent {
  selectedCard = 0;

  readonly fitCards = [
    { icon: '🧠', title: 'Best fit', tag: 'QUEST MATCH', color: 'gold', stat: 95, body: 'Staff and lead roles spanning backend platforms, distributed systems, and practical AI products.' },
    { icon: '⚙️', title: 'Operating mode', tag: 'LEVEL FLOW', color: 'red', stat: 92, body: 'Architecture clarity, delivery momentum, and execution that turns ambiguity into shipped systems.' },
    { icon: '🤝', title: 'Team style', tag: 'CO-OP MODE', color: 'green', stat: 90, body: 'Works best with product-minded teams that want fast iteration without losing engineering rigor.' },
    { icon: '📍', title: 'Collab shape', tag: 'WORLD MAP', color: 'blue', stat: 93, body: 'Comfortable leading across distributed teams, ambiguous problem spaces, and high-leverage technical decisions.' },
  ];

  readonly collaborationTracks = [
    'Platform and backend architecture for systems that need reliability under real traffic.',
    '0→1 or scaling Gen AI product work where quality, UX, and operational constraints all matter.',
    'Staff-level execution: technical direction, prioritization, system design, and cross-team leverage.',
  ];

  readonly firstWeekOutcomes = [
    'Pressure-test the system shape, product constraints, and delivery risks.',
    'Identify the technical decisions that unblock product speed the most.',
    'Turn broad goals into an execution plan the team can actually ship against.',
  ];

  readonly operatingPrinciples = [
    { title: 'Reduce ambiguity fast', body: 'Turning fuzzy goals into system shapes, trade-offs, and concrete execution paths early.' },
    { title: 'Bias toward durable systems', body: 'Optimizing for systems that hold up in production, not just on architecture diagrams.' },
    { title: 'Create leverage, not noise', body: 'Better decisions, faster teams, and a clearer technical direction that compounds.' },
  ];

  readonly emphasisAreas = [
    { label: 'Reliability', value: 'production-first systems', pct: 96 },
    { label: 'Speed', value: 'high-signal execution', pct: 93 },
    { label: 'Leadership', value: 'cross-team leverage', pct: 91 },
    { label: 'Product sense', value: 'useful AI + platform outcomes', pct: 94 },
  ];
}
