import { Player, Level, QuestionBlock } from './mario-entities';
import { MarioRenderer } from './mario-renderer';
import { MarioControls } from './mario-controls';
import { updatePhysics, CollisionResult } from './mario-physics';
import { createPlayer } from './mario-level-generator';
import { MarioAudio } from './mario-audio';

export type GameState = 'idle' | 'running' | 'paused' | 'won' | 'lost';

export interface GameCallbacks {
  onDeath: () => void;
  onWin: () => void;
  onScoreChange: (score: number, coins: number, lives: number) => void;
}

export class MarioEngine {
  private renderer: MarioRenderer;
  private controls: MarioControls;
  private animFrameId = 0;
  private state: GameState = 'idle';
  private lastTime = 0;
  private accumulator = 0;
  private readonly STEP = 1000 / 60;

  player: Player;
  level!: Level;
  private callbacks: GameCallbacks;
  elapsedFrames = 0;
  enemiesStomped = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.renderer = new MarioRenderer(canvas);
    this.controls = new MarioControls();
    this.callbacks = callbacks;
    this.player = createPlayer();
  }

  resize(w: number, h: number): void {
    this.renderer.resize(w, h);
  }

  loadLevel(level: Level): void {
    this.level = level;
    this.player = createPlayer();
    this.elapsedFrames = 0;
    this.enemiesStomped = 0;
    this.state = 'idle';
  }

  start(): void {
    if (!this.level) return;
    this.state = 'running';
    this.controls.bind();
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop(this.lastTime);
  }

  pause(): void {
    this.state = 'paused';
    this.controls.reset();
  }

  resume(): void {
    if (this.state === 'paused') {
      this.state = 'running';
      this.lastTime = performance.now();
      this.accumulator = 0;
      this.loop(this.lastTime);
    }
  }

  stop(): void {
    this.state = 'idle';
    cancelAnimationFrame(this.animFrameId);
    this.controls.unbind();
  }

  getState(): GameState { return this.state; }
  getControls(): MarioControls { return this.controls; }

  private handlePowerUp(qb: QuestionBlock): void {
    MarioAudio.questionBlock();
    switch (qb.reward) {
      case 'star':
        this.player.activateStar();
        this.player.score += 200;
        MarioAudio.powerUp();
        break;
      case 'mushroom':
        this.player.grow();
        this.player.score += 100;
        MarioAudio.powerUp();
        break;
      case 'coin':
      default:
        this.player.coins += 3;
        this.player.score += 50;
        MarioAudio.coin();
        break;
    }
    this.notifyScore();
  }

  private loop = (time: number): void => {
    if (this.state !== 'running') return;

    this.animFrameId = requestAnimationFrame(this.loop);
    const dt = Math.min(time - this.lastTime, 100);
    this.lastTime = time;
    this.accumulator += dt;

    while (this.accumulator >= this.STEP) {
      this.tick();
      this.accumulator -= this.STEP;
    }

    this.renderer.render(this.player, this.level);
  };

  private tick(): void {
    if (this.state !== 'running') return;
    this.elapsedFrames++;
    const keys = this.controls.getState();
    const result = updatePhysics(this.player, this.level, keys);

    this.handleCollisionResult(result);
  }

  private handleCollisionResult(result: CollisionResult): void {
    if (result.jumped) MarioAudio.jump();

    if (result.coinCollected) MarioAudio.coin();

    if (result.hitQuestionBlock) {
      this.handlePowerUp(result.hitQuestionBlock);
    }

    if (result.hitEnemy) {
      MarioAudio.hit();
      if (this.player.state === 'big') {
        this.player.shrink();
      } else {
        this.player.lives--;
        if (this.player.lives <= 0) {
          this.state = 'lost';
          cancelAnimationFrame(this.animFrameId);
          this.controls.unbind();
          MarioAudio.die();
          this.callbacks.onDeath();
          return;
        }
        this.player.invincibleTimer = 90;
      }
      this.notifyScore();
    }

    if (result.stompedEnemy) {
      MarioAudio.stomp();
      this.enemiesStomped++;
      this.notifyScore();
    }

    if (result.died) {
      this.player.lives--;
      if (this.player.lives <= 0) {
        this.state = 'lost';
        cancelAnimationFrame(this.animFrameId);
        this.controls.unbind();
        MarioAudio.die();
        this.callbacks.onDeath();
        return;
      }
      this.respawn();
      this.notifyScore();
    }

    if (result.reachedFlag) {
      const timeBonus = Math.max(0, 300 - Math.floor(this.elapsedFrames / 60)) * 2;
      this.player.score += timeBonus;
      this.state = 'won';
      cancelAnimationFrame(this.animFrameId);
      this.controls.unbind();
      MarioAudio.win();
      this.notifyScore();
      this.callbacks.onWin();
    }
  }

  private respawn(): void {
    const p = createPlayer();
    this.player.x = p.x;
    this.player.y = p.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.state = 'small';
    this.player.h = p.h;
    this.player.invincibleTimer = 120;
  }

  private notifyScore(): void {
    this.callbacks.onScoreChange(this.player.score, this.player.coins, this.player.lives);
  }
}
