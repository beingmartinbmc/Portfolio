import { Player, Level, QuestionBlock, Enemy, FloatingText, Debris, Particle, getCategoryKeywords, getCategoryBugKeywords } from './mario-entities';
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
  private keywords: string[] = [];
  private bugKeywords: string[] = [];
  private keywordIndex = 0;
  private bugKeywordIndex = 0;

  player: Player;
  level!: Level;
  private callbacks: GameCallbacks;
  elapsedFrames = 0;
  enemiesStomped = 0;
  private wasOnGround = true;
  private prevVy = 0;

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

    this.keywords = getCategoryKeywords(level.category);
    this.bugKeywords = getCategoryBugKeywords(level.category);
    this.keywordIndex = 0;
    this.bugKeywordIndex = 0;
    this.renderer.setCategory(level.category);
    this.renderer.setLevelType(level.levelType);
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

  private nextKeyword(): string {
    const kw = this.keywords[this.keywordIndex % this.keywords.length];
    this.keywordIndex++;
    return kw ?? '';
  }

  private nextBugKeyword(): string {
    const kw = this.bugKeywords[this.bugKeywordIndex % this.bugKeywords.length];
    this.bugKeywordIndex++;
    return kw ?? '';
  }

  private spawnEnemyKeyword(enemy: Enemy): void {
    const kw = enemy.keyword || this.nextBugKeyword();
    this.level.floatingTexts.push(
      new FloatingText(enemy.x, enemy.y - 8, `🐛 ${kw}`, '#ff6b6b', 80)
    );
  }

  private handlePowerUp(qb: QuestionBlock): void {
    MarioAudio.questionBlock();
    const kw = qb.keyword || this.nextKeyword();
    let color: string;

    switch (qb.reward) {
      case 'star':
        this.player.activateStar();
        this.player.score += 200;
        MarioAudio.powerUp();
        color = '#f59e0b';
        break;
      case 'mushroom':
        if (this.player.state === 'big') {
          MarioAudio.powerUp();
          color = '#f97316';
        } else {
          MarioAudio.powerUp();
          color = '#22c55e';
        }
        this.player.grow();
        this.player.score += 100;
        break;
      case 'coin':
      default:
        this.player.coins += 3;
        this.player.score += 50;
        MarioAudio.coin();
        color = '#fbbf24';
        break;
    }

    this.level.floatingTexts.push(
      new FloatingText(qb.x, qb.y - 10, kw, color, 80)
    );
    this.emitSparkle(qb.x + qb.w / 2, qb.y, color, qb.reward === 'star' ? 16 : 8);
    this.renderer.shake(qb.reward === 'star' ? 4 : 1.5);
    this.notifyScore();
  }

  private handleBrickBreak(brick: import('./mario-entities').Platform): void {
    MarioAudio.brickBreak();
    const cx = brick.x + brick.w / 2;
    const cy = brick.y + brick.h / 2;
    this.level.debris.push(
      new Debris(cx - 6, cy, -2, -5),
      new Debris(cx + 6, cy, 2, -5),
      new Debris(cx - 6, cy, -1, -3.5),
      new Debris(cx + 6, cy, 1, -3.5),
    );

    if (brick.label) {
      this.level.floatingTexts.push(
        new FloatingText(brick.x, brick.y - 8, brick.label, '#ef4444', 70)
      );
    }
    this.emitSparkle(cx, cy, '#d97706', 10);
    this.renderer.shake(3);
    this.notifyScore();
  }

  /** Radial burst of glittering particles. */
  private emitSparkle(x: number, y: number, color: string, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 1.5 + Math.random() * 2.4;
      this.level.particles.push(
        new Particle(
          x, y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 0.5,
          color, 2 + Math.random() * 2, 20 + Math.random() * 12, 'spark', 0.12,
        ),
      );
    }
  }

  /** Soft puff used when an enemy is squashed. */
  private emitPuff(x: number, y: number, color: string): void {
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI + (i - 4) * 0.32;
      this.level.particles.push(
        new Particle(x, y, Math.cos(angle) * 1.6, Math.sin(angle) * 1.6, color, 3 + Math.random() * 2, 16 + Math.random() * 8, 'puff', 0.05),
      );
    }
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
    this.wasOnGround = this.player.onGround;
    this.prevVy = this.player.vy;
    const result = updatePhysics(this.player, this.level, keys);

    this.handleLandingAndDust();
    this.handleCollisionResult(result);

    // Advance and cull particles
    for (const part of this.level.particles) part.tick();
    if (this.level.particles.length > 0) {
      this.level.particles = this.level.particles.filter(part => part.alive);
    }
  }

  /** Kicks up dust when landing hard and trailing dust while sprinting. */
  private handleLandingAndDust(): void {
    const p = this.player;
    if (!this.wasOnGround && p.onGround && this.prevVy > 4) {
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h;
      const strength = Math.min(this.prevVy / 12, 1);
      this.renderer.shake(2 + strength * 4);
      for (let i = 0; i < 6; i++) {
        const dir = (i - 3) * 0.55;
        this.level.particles.push(
          new Particle(cx, cy, dir, -0.6 - Math.random() * 0.8, 'rgba(220,220,210,0.85)', 3 + Math.random() * 2, 18 + Math.random() * 8, 'dust', 0.08),
        );
      }
    }

    // Running dust trail
    if (p.onGround && p.running && this.elapsedFrames % 5 === 0) {
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h;
      this.level.particles.push(
        new Particle(cx, cy, -p.vx * 0.3, -0.5, 'rgba(210,210,200,0.6)', 2.5, 14, 'dust', 0.1),
      );
    }

    // Flight wing-flutter trail (Air mode)
    if (p.flying && this.elapsedFrames % 3 === 0) {
      const cx = p.x + p.w / 2;
      const cy = p.y + p.h * 0.8;
      this.level.particles.push(
        new Particle(cx, cy, -p.vx * 0.2 + (Math.random() - 0.5), 0.6 + Math.random() * 0.6, 'rgba(255,255,255,0.65)', 2 + Math.random() * 1.5, 16, 'puff', 0.02),
      );
    }
  }

  private handleCollisionResult(result: CollisionResult): void {
    if (result.jumped) MarioAudio.jump();

    if (result.firedFireball) MarioAudio.fireball();

    if (result.coinCollected) MarioAudio.coin();

    if (result.hitQuestionBlock) {
      this.handlePowerUp(result.hitQuestionBlock);
    }

    if (result.brickBroken) {
      this.handleBrickBreak(result.brickBroken);
    }

    if (result.brickBumped) {
      MarioAudio.brickBump();
    }

    if (result.hitEnemy) {
      MarioAudio.hit();
      this.renderer.shake(5);
      if (this.player.state === 'fire') {
        this.player.shrink();
      } else if (this.player.state === 'big') {
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
      this.emitPuff(result.stompedEnemy.x + result.stompedEnemy.w / 2, result.stompedEnemy.y + result.stompedEnemy.h / 2, 'rgba(180,120,70,0.85)');
      this.renderer.shake(2);
      this.spawnEnemyKeyword(result.stompedEnemy);
      this.notifyScore();
    }

    for (const enemy of result.fireballKilledEnemies) {
      MarioAudio.fireHit();
      this.enemiesStomped++;
      this.emitSparkle(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#f97316', 10);
      this.spawnEnemyKeyword(enemy);
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
