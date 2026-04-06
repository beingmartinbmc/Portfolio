export const TILE = 32;
export const GRAVITY = 0.52;
export const JUMP_FORCE = -11;
export const MOVE_SPEED = 3.8;
export const MAX_FALL = 12;

export interface AABB {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type PlatformType = 'ground' | 'brick' | 'question' | 'pipe';
export type EnemyType = 'goomba' | 'koopa';
export type PlayerState = 'small' | 'big' | 'star';
export type Direction = 'left' | 'right';

export class Player {
  x: number;
  y: number;
  vx = 0;
  vy = 0;
  w = TILE * 0.75;
  h = TILE;
  lives = 3;
  coins = 0;
  score = 0;
  state: PlayerState = 'small';
  facing: Direction = 'right';
  onGround = false;
  invincibleTimer = 0;
  starTimer = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get box(): AABB {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  grow(): void {
    if (this.state === 'small') {
      this.state = 'big';
      this.h = TILE * 1.5;
      this.y -= TILE * 0.5;
    }
  }

  shrink(): void {
    if (this.state === 'big') {
      this.state = 'small';
      this.y += TILE * 0.5;
      this.h = TILE;
      this.invincibleTimer = 90;
    }
  }

  activateStar(): void {
    this.starTimer = 300;
  }
}

export class Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type: PlatformType;
  hit = false;
  coinCollected = false;
  destroyed = false;
  label = '';

  constructor(x: number, y: number, w: number, h: number, type: PlatformType) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
  }

  get box(): AABB {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

export class Enemy {
  x: number;
  y: number;
  vx: number;
  w = TILE * 0.85;
  h = TILE * 0.85;
  type: EnemyType;
  alive = true;
  squashTimer = 0;

  constructor(x: number, y: number, type: EnemyType) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = type === 'koopa' ? -1.5 : -1;
  }

  get box(): AABB {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

export class Coin {
  x: number;
  y: number;
  w = TILE * 0.5;
  h = TILE * 0.5;
  collected = false;
  animTimer = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get box(): AABB {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
}

export class FlagPole {
  x: number;
  y: number;
  h: number;

  constructor(x: number, y: number, h: number) {
    this.x = x;
    this.y = y;
    this.h = h;
  }

  get box(): AABB {
    return { x: this.x, y: this.y, w: TILE * 0.3, h: this.h };
  }
}

export type PowerUpType = 'coin' | 'mushroom' | 'star';

export class QuestionBlock extends Platform {
  reward: PowerUpType;
  keyword = '';

  constructor(x: number, y: number, reward: PowerUpType = 'coin') {
    super(x, y, TILE, TILE, 'question');
    this.reward = reward;
  }
}

export class FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;

  constructor(x: number, y: number, text: string, color = '#fff', life = 60) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = life;
    this.maxLife = life;
  }

  get alive(): boolean { return this.life > 0; }

  tick(): void {
    this.life--;
    this.y -= 0.8;
  }
}

export class Debris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life = 30;

  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  get alive(): boolean { return this.life > 0; }

  tick(): void {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.4;
    this.life--;
  }
}

export interface Level {
  platforms: Platform[];
  enemies: Enemy[];
  coins: Coin[];
  questionBlocks: QuestionBlock[];
  flagPole: FlagPole;
  floatingTexts: FloatingText[];
  debris: Debris[];
  width: number;
  height: number;
  category: string;
}

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  backend: ['REST API', 'CRUD', 'Auth', 'DB Index', 'ORM', 'Retry', 'Timeout', 'Circuit Breaker', 'Rate Limit', 'Idempotent', 'Webhook', 'gRPC', 'Middleware', 'Connection Pool', 'Thread Pool'],
  distributed: ['Kafka', 'Partition', 'Replication', 'Consensus', 'Raft', 'Shard', 'Quorum', 'CAP', 'Saga', 'Event Bus', 'Dead Letter', 'Backpressure', 'Fan-out', 'Exactly Once', 'Leader Election'],
  genai: ['RAG', 'Embeddings', 'Vector DB', 'Prompt', 'Fine-tune', 'Token', 'Context Window', 'Hallucination', 'Eval', 'Agent', 'Tool Call', 'Retrieval', 'Chain of Thought', 'Guardrails', 'RLHF'],
  platform: ['CI/CD', 'k8s', 'Docker', 'Terraform', 'Grafana', 'Prometheus', 'SLO', 'Canary', 'Blue-Green', 'Feature Flag', 'GitOps', 'Helm', 'Sidecar', 'Service Mesh', 'Runbook'],
  architecture: ['Load Balancer', 'CDN', 'Cache', 'CQRS', 'Event Source', 'Domain', 'Hexagonal', 'Microservice', 'Monolith', 'API Gateway', 'BFF', 'Strangler Fig', 'Bounded Context', 'Anti-Corruption', 'Bulkhead'],
  leadership: ['RFC', 'ADR', 'Tech Debt', 'Roadmap', 'Stakeholder', 'Incident', 'Postmortem', 'On-Call', 'Mentoring', 'Code Review', 'Sprint', 'Retro', 'OKR', 'Scope', 'Alignment'],
};
