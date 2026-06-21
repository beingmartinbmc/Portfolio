export interface HeroMetric {
  value: string;
  label: string;
}

export interface FocusArea {
  icon: string;
  title: string;
  tag: string;
  description: string;
  color: string;
}

export const HERO_METRICS: HeroMetric[] = [
  { value: '6+', label: 'years building backend platforms' },
  { value: '2.7K', label: 'RPS handled on production systems' },
  { value: '200K+', label: 'daily verifications automated' },
  { value: '10M', label: 'concurrent users supported' }
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    icon: '🤖',
    title: 'AI Agents & LLMs',
    tag: 'STAR MODE',
    description: 'Tool-calling agents and Slack bots — including an on-call bot that debugs across Splunk, GitHub, Confluence, Drive, and Slack.',
    color: 'gold'
  },
  {
    icon: '🔥',
    title: 'RAG & Gen AI in Production',
    tag: 'FIRE FLOWER',
    description: 'Retrieval pipelines, prompt and context work, evals, and guardrails — the stuff that keeps AI useful past the demo.',
    color: 'green'
  },
  {
    icon: '🍄',
    title: 'Backend Systems',
    tag: 'POWER-UP',
    description: 'Java, Kafka, Redis, APIs, and event-driven workflows — plus the messy operational edges that keep high-traffic systems up.',
    color: 'red'
  }
];
