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
    { icon: '🧠', title: 'Best fit', tag: 'QUEST MATCH', color: 'gold', stat: 95, body: 'Staff and lead roles across AI products, backend platforms, and distributed systems.' },
    { icon: '⚙️', title: 'Operating mode', tag: 'LEVEL FLOW', color: 'red', stat: 92, body: 'Clear architecture, steady delivery, and actually shipping things instead of debating them.' },
    { icon: '🤝', title: 'Team style', tag: 'CO-OP MODE', color: 'green', stat: 90, body: 'I do my best work with product-minded teams that move fast but still care about the engineering.' },
    { icon: '📍', title: 'Collab shape', tag: 'WORLD MAP', color: 'blue', stat: 93, body: 'Comfortable leading across distributed teams and figuring out messy, half-defined problems.' },
  ];

  readonly collaborationTracks = [
    'AI agent and LLM work — tool-calling agents, Slack bots, RAG pipelines, and the evals that keep them honest.',
    'Backend and platform architecture for systems that need to stay up under real traffic.',
    'Staff-level work: setting technical direction, prioritizing, system design, and unblocking other teams.',
  ];

  readonly firstWeekOutcomes = [
    'Get a real read on the system, the product constraints, and where delivery is most likely to slip.',
    'Find the few technical calls that would unblock the team the most.',
    'Turn broad goals into a plan the team can actually start shipping against.',
  ];

  readonly operatingPrinciples = [
    { title: 'Cut the ambiguity early', body: 'Take fuzzy goals and turn them into something concrete — trade-offs, decisions, and a path forward.' },
    { title: 'Build things that last', body: 'Optimize for systems that hold up in production, not ones that only look clean on a diagram.' },
    { title: 'Make the team faster', body: 'Better decisions and clearer direction so the whole team moves quicker, not just me.' },
  ];

  readonly emphasisAreas = [
    { label: 'Reliability', value: 'production-first systems', pct: 96 },
    { label: 'Speed', value: 'ship without the noise', pct: 93 },
    { label: 'Leadership', value: 'unblocking other teams', pct: 91 },
    { label: 'Product sense', value: 'AI + platform that ships', pct: 94 },
  ];
}
