import { TILE, Player, Platform, Enemy, Coin, QuestionBlock, FlagPole, Level } from './mario-entities';

const SKY_TOP = '#09091a';
const SKY_BOT = '#16213e';
const GROUND_TOP = '#2d5016';
const GROUND_SIDE = '#3a6b1e';
const BRICK_FILL = '#8b4513';
const BRICK_LINE = '#6b3410';
const QUESTION_FILL = '#fbbf24';
const QUESTION_HIT = '#7c6312';
const PIPE_FILL = '#22c55e';
const PIPE_DARK = '#16a34a';
const PLAYER_RED = '#ef4444';
const PLAYER_BLUE = '#3b82f6';
const PLAYER_SKIN = '#fcd34d';
const GOOMBA_BODY = '#8b4513';
const GOOMBA_FEET = '#5c2d0e';
const KOOPA_BODY = '#22c55e';
const KOOPA_SHELL = '#15803d';
const COIN_COLOR = '#fbbf24';
const FLAG_POLE_COLOR = '#94a3b8';
const FLAG_COLOR = '#ef4444';

export class MarioRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvasW: number;
  private canvasH: number;
  private frameCount = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.canvasW = canvas.width;
    this.canvasH = canvas.height;
    this.ctx.imageSmoothingEnabled = false;
  }

  resize(w: number, h: number): void {
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvasW = w;
    this.canvasH = h;
    this.ctx.imageSmoothingEnabled = false;
  }

  render(player: Player, level: Level): void {
    this.frameCount++;
    const camX = Math.max(0, Math.min(player.x - this.canvasW / 2 + player.w / 2, level.width - this.canvasW));
    const camY = 0;

    this.drawSky();
    this.drawClouds(camX);

    this.ctx.save();
    this.ctx.translate(-camX, -camY);

    for (const p of level.platforms) this.drawPlatform(p);
    for (const qb of level.questionBlocks) this.drawQuestionBlock(qb);
    for (const coin of level.coins) this.drawCoin(coin);
    for (const enemy of level.enemies) this.drawEnemy(enemy);
    this.drawFlagPole(level.flagPole);
    this.drawPlayer(player);

    this.ctx.restore();
  }

  private drawSky(): void {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvasH);
    grad.addColorStop(0, SKY_TOP);
    grad.addColorStop(1, SKY_BOT);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);

    // Subtle stars
    this.ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5 + 50) % this.canvasW;
      const sy = (i * 97.3 + 20) % (this.canvasH * 0.5);
      const size = (i % 3) + 1;
      this.ctx.fillRect(sx, sy, size, size);
    }
  }

  private drawClouds(camX: number): void {
    this.ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 6; i++) {
      const cx = (i * 320 + 100 - camX * 0.3) % (this.canvasW + 200) - 50;
      const cy = 40 + (i % 3) * 50;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      this.ctx.arc(cx + 25, cy - 10, 25, 0, Math.PI * 2);
      this.ctx.arc(cx + 50, cy, 30, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawPlatform(p: Platform): void {
    if (p.type === 'ground') {
      this.ctx.fillStyle = GROUND_TOP;
      this.ctx.fillRect(p.x, p.y, p.w, TILE * 0.3);
      this.ctx.fillStyle = GROUND_SIDE;
      this.ctx.fillRect(p.x, p.y + TILE * 0.3, p.w, p.h - TILE * 0.3);
      // Grid lines
      this.ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      this.ctx.lineWidth = 1;
      for (let tx = p.x; tx < p.x + p.w; tx += TILE) {
        this.ctx.strokeRect(tx, p.y, TILE, p.h);
      }
    } else if (p.type === 'brick') {
      this.ctx.fillStyle = BRICK_FILL;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      this.ctx.strokeStyle = BRICK_LINE;
      this.ctx.lineWidth = 1;
      for (let tx = p.x; tx < p.x + p.w; tx += TILE) {
        for (let ty = p.y; ty < p.y + p.h; ty += TILE) {
          this.ctx.strokeRect(tx + 1, ty + 1, TILE - 2, TILE - 2);
          // Mortar
          this.ctx.fillStyle = BRICK_LINE;
          this.ctx.fillRect(tx + TILE / 2 - 0.5, ty, 1, TILE);
          this.ctx.fillRect(tx, ty + TILE / 2 - 0.5, TILE, 1);
          this.ctx.fillStyle = BRICK_FILL;
        }
      }
    } else if (p.type === 'pipe') {
      this.ctx.fillStyle = PIPE_FILL;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      this.ctx.fillStyle = PIPE_DARK;
      this.ctx.fillRect(p.x, p.y, 4, p.h);
      this.ctx.fillRect(p.x + p.w - 4, p.y, 4, p.h);
      // Pipe top rim
      this.ctx.fillStyle = PIPE_FILL;
      this.ctx.fillRect(p.x - 4, p.y, p.w + 8, TILE * 0.4);
      this.ctx.fillStyle = PIPE_DARK;
      this.ctx.fillRect(p.x - 4, p.y, 4, TILE * 0.4);
      this.ctx.fillRect(p.x + p.w, p.y, 4, TILE * 0.4);
    }
  }

  private drawQuestionBlock(qb: QuestionBlock): void {
    const fill = qb.hit ? QUESTION_HIT : QUESTION_FILL;
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(qb.x, qb.y, qb.w, qb.h);

    this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(qb.x, qb.y, qb.w, qb.h);

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    if (!qb.hit) {
      const bounce = Math.sin(this.frameCount * 0.08) * 2;
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 18px "Press Start 2P", monospace';
      this.ctx.fillText('?', qb.x + qb.w / 2, qb.y + qb.h / 2 + bounce);
    } else {
      this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
      this.ctx.font = 'bold 14px "Press Start 2P", monospace';
      this.ctx.fillText('X', qb.x + qb.w / 2, qb.y + qb.h / 2);
    }
  }

  private drawCoin(coin: Coin): void {
    if (coin.collected) {
      if (coin.animTimer > 0) {
        coin.animTimer--;
        this.ctx.globalAlpha = coin.animTimer / 20;
        this.ctx.fillStyle = COIN_COLOR;
        this.ctx.beginPath();
        this.ctx.arc(coin.x + coin.w / 2, coin.y - (20 - coin.animTimer) * 2, coin.w / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
      return;
    }

    const scaleX = Math.abs(Math.cos(this.frameCount * 0.06));
    this.ctx.save();
    this.ctx.translate(coin.x + coin.w / 2, coin.y + coin.h / 2);
    this.ctx.scale(scaleX, 1);
    this.ctx.fillStyle = COIN_COLOR;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, coin.w / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#d97706';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawEnemy(enemy: Enemy): void {
    if (!enemy.alive && enemy.squashTimer <= 0) return;

    const alpha = enemy.alive ? 1 : enemy.squashTimer / 15;
    this.ctx.globalAlpha = alpha;

    if (enemy.type === 'goomba') {
      const squash = enemy.alive ? 1 : 0.3;
      // Body
      this.ctx.fillStyle = GOOMBA_BODY;
      this.ctx.fillRect(enemy.x + 2, enemy.y + enemy.h * (1 - squash), enemy.w - 4, enemy.h * squash);
      // Eyes
      if (enemy.alive) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(enemy.x + enemy.w * 0.25, enemy.y + enemy.h * 0.2, 5, 5);
        this.ctx.fillRect(enemy.x + enemy.w * 0.6, enemy.y + enemy.h * 0.2, 5, 5);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(enemy.x + enemy.w * 0.3, enemy.y + enemy.h * 0.25, 3, 3);
        this.ctx.fillRect(enemy.x + enemy.w * 0.65, enemy.y + enemy.h * 0.25, 3, 3);
      }
      // Feet
      this.ctx.fillStyle = GOOMBA_FEET;
      this.ctx.fillRect(enemy.x, enemy.y + enemy.h - 4, enemy.w * 0.35, 4);
      this.ctx.fillRect(enemy.x + enemy.w * 0.65, enemy.y + enemy.h - 4, enemy.w * 0.35, 4);
    } else {
      // Koopa
      this.ctx.fillStyle = KOOPA_SHELL;
      this.ctx.fillRect(enemy.x + 2, enemy.y + enemy.h * 0.3, enemy.w - 4, enemy.h * 0.5);
      this.ctx.fillStyle = KOOPA_BODY;
      this.ctx.fillRect(enemy.x + enemy.w * 0.3, enemy.y, enemy.w * 0.4, enemy.h * 0.35);
      // Eyes
      if (enemy.alive) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(enemy.x + enemy.w * 0.35, enemy.y + 4, 4, 4);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(enemy.x + enemy.w * 0.38, enemy.y + 5, 2, 2);
      }
    }

    this.ctx.globalAlpha = 1;
  }

  private drawFlagPole(fp: FlagPole): void {
    // Pole
    this.ctx.fillStyle = FLAG_POLE_COLOR;
    this.ctx.fillRect(fp.x + TILE * 0.1, fp.y, TILE * 0.1, fp.h);

    // Ball on top
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.beginPath();
    this.ctx.arc(fp.x + TILE * 0.15, fp.y, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Flag
    this.ctx.fillStyle = FLAG_COLOR;
    this.ctx.beginPath();
    this.ctx.moveTo(fp.x + TILE * 0.2, fp.y + 4);
    this.ctx.lineTo(fp.x + TILE * 0.2 + 24, fp.y + 14);
    this.ctx.lineTo(fp.x + TILE * 0.2, fp.y + 24);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawPlayer(player: Player): void {
    const blink = player.invincibleTimer > 0 && Math.floor(this.frameCount / 3) % 2 === 0;
    if (blink) return;

    const starGlow = player.starTimer > 0;
    if (starGlow) {
      const hue = (this.frameCount * 8) % 360;
      this.ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
      this.ctx.shadowBlur = 12;
    }

    const x = player.x;
    const y = player.y;
    const w = player.w;
    const h = player.h;
    const flip = player.facing === 'left';

    this.ctx.save();
    if (flip) {
      this.ctx.translate(x + w, y);
      this.ctx.scale(-1, 1);
      this.ctx.translate(0, 0);
    } else {
      this.ctx.translate(x, y);
    }

    const isSmall = player.state === 'small';
    const headH = isSmall ? h * 0.45 : h * 0.3;
    const bodyH = isSmall ? h * 0.35 : h * 0.45;
    const legH = h - headH - bodyH;

    // Hat
    this.ctx.fillStyle = PLAYER_RED;
    this.ctx.fillRect(w * 0.15, 0, w * 0.7, headH * 0.4);
    this.ctx.fillRect(w * 0.05, headH * 0.4, w * 0.9, headH * 0.2);

    // Face
    this.ctx.fillStyle = PLAYER_SKIN;
    this.ctx.fillRect(w * 0.15, headH * 0.5, w * 0.7, headH * 0.5);
    // Eyes
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(w * 0.55, headH * 0.55, 3, 3);

    // Body / overalls
    this.ctx.fillStyle = PLAYER_RED;
    this.ctx.fillRect(w * 0.1, headH, w * 0.8, bodyH * 0.3);
    this.ctx.fillStyle = PLAYER_BLUE;
    this.ctx.fillRect(w * 0.15, headH + bodyH * 0.3, w * 0.7, bodyH * 0.7);

    // Arms
    this.ctx.fillStyle = PLAYER_SKIN;
    const armW = w * 0.15;
    this.ctx.fillRect(-armW + 2, headH + 2, armW, bodyH * 0.5);
    this.ctx.fillRect(w - 2, headH + 2, armW, bodyH * 0.5);

    // Legs
    this.ctx.fillStyle = PLAYER_BLUE;
    const legW = w * 0.3;
    const legY = headH + bodyH;
    const walkCycle = Math.sin(this.frameCount * 0.2) * 3;
    const moving = Math.abs(player.vx) > 0.5;
    this.ctx.fillRect(w * 0.1, legY + (moving ? walkCycle : 0), legW, legH);
    this.ctx.fillRect(w * 0.6, legY + (moving ? -walkCycle : 0), legW, legH);

    // Shoes
    this.ctx.fillStyle = '#7c2d12';
    this.ctx.fillRect(w * 0.05, legY + legH - 4 + (moving ? walkCycle : 0), legW + 3, 4);
    this.ctx.fillRect(w * 0.55, legY + legH - 4 + (moving ? -walkCycle : 0), legW + 3, 4);

    this.ctx.restore();
    if (starGlow) {
      this.ctx.shadowColor = 'transparent';
      this.ctx.shadowBlur = 0;
    }
  }
}
