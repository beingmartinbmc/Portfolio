export const TILE = 32;
export const GRAVITY = 0.55;
export const JUMP_FORCE = -10.5;
export const MOVE_SPEED = 3.5;
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

  constructor(x: number, y: number, reward: PowerUpType = 'coin') {
    super(x, y, TILE, TILE, 'question');
    this.reward = reward;
  }
}

export interface Level {
  platforms: Platform[];
  enemies: Enemy[];
  coins: Coin[];
  questionBlocks: QuestionBlock[];
  flagPole: FlagPole;
  width: number;
  height: number;
}
