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
  { value: '6+', label: 'years building distributed systems' },
  { value: '50K+', label: 'concurrent telephony sessions' },
  { value: '2M+', label: 'daily transactions screened for fraud' },
  { value: '65%', label: 'support workflows automated with LLMs' }
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    icon: '🍄',
    title: 'Distributed Systems',
    tag: 'POWER-UP',
    description: 'Java and Go services on Kafka, Redis, and AWS: 10K+ events/sec at sub-200ms P99, plus the on-call ownership that keeps them up.',
    color: 'red'
  },
  {
    icon: '🤖',
    title: 'AI Platforms & LLM Workflows',
    tag: 'STAR MODE',
    description: 'LLM-driven Slack automation, RAG, vector and semantic search, and MCP tooling, built to give grounded answers in production.',
    color: 'gold'
  },
  {
    icon: '🔥',
    title: 'Risk, Payments & Onboarding',
    tag: 'FIRE FLOWER',
    description: 'Low-latency fraud detection and KYC pipelines for consumer platforms with millions of daily transactions.',
    color: 'green'
  }
];
