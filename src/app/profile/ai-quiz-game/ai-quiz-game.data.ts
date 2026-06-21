import { LevelType } from './game/mario-entities';

export interface QuizCategory {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface QuizDifficulty {
  value: string;
  label: string;
  description: string;
  color: string;
}

export interface QuizLevelType {
  value: LevelType;
  label: string;
  icon: string;
  description: string;
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  { value: 'backend', label: 'Backend Foundations', icon: '🍄', description: 'APIs, data flows, idempotency, service design' },
  { value: 'distributed', label: 'Distributed Systems', icon: '🚇', description: 'Kafka, queues, caching, consistency, resilience' },
  { value: 'genai', label: 'Gen AI Systems', icon: '🤖', description: 'RAG, evals, prompts, agents, product quality' },
  { value: 'platform', label: 'Platform Engineering', icon: '🛠️', description: 'Observability, CI/CD, reliability, tooling leverage' },
  { value: 'architecture', label: 'System Design', icon: '🏰', description: 'Trade-offs, scale paths, fault tolerance, throughput' },
  { value: 'leadership', label: 'Staff Engineering', icon: '⭐', description: 'Cross-team influence, prioritization, technical leadership' }
];

export const QUIZ_DIFFICULTIES: QuizDifficulty[] = [
  { value: 'Easy', label: 'Warm-Up', description: 'Fewer enemies, more power-ups', color: 'success' },
  { value: 'Medium', label: 'Speed Run', description: 'Balanced challenge', color: 'warning' },
  { value: 'Hard', label: 'Boss Fight', description: 'Dense enemies, big gaps', color: 'danger' }
];

// The three play modes: each is a full Mario platformer with its own movement style.
export const QUIZ_LEVEL_TYPES: QuizLevelType[] = [
  { value: 'ground', label: 'Land', icon: '🌿', description: 'Classic overworld — run, jump, and stomp across staged gaps' },
  { value: 'water', label: 'Sea', icon: '🌊', description: 'Dive underwater — swim with buoyant strokes through dense coin trails' },
  { value: 'sky', label: 'Sky', icon: '☁️', description: 'Take flight — hold jump to soar and dive across floating routes' },
];
