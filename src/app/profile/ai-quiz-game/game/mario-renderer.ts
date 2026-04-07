import { TILE, Player, Platform, Enemy, Coin, QuestionBlock, Fireball, FlagPole, Level, FloatingText, Debris } from './mario-entities';

const SKY_TOP = '#09091a';
const SKY_BOT = '#16213e';
const SKY_STAGE_TOP = '#7dd3fc';
const SKY_STAGE_BOT = '#eff6ff';
const WATER_TOP = '#082f49';
const WATER_BOT = '#155e75';
const GROUND_TOP = '#2d5016';
const GROUND_SIDE = '#3a6b1e';
const SKY_GROUND_TOP = '#cbd5e1';
const SKY_GROUND_SIDE = '#94a3b8';
const WATER_GROUND_TOP = '#0f766e';
const WATER_GROUND_SIDE = '#115e59';
const BRICK_FILL = '#8b4513';
const BRICK_LINE = '#6b3410';
const QUESTION_FILL = '#fbbf24';
const QUESTION_HIT = '#7c6312';
const PIPE_FILL = '#22c55e';
const PIPE_DARK = '#16a34a';
const PLAYER_RED = '#ef4444';
const PLAYER_BLUE = '#3b82f6';
const PLAYER_SKIN = '#fcd34d';
const PLAYER_WHITE = '#f8fafc';
const FIRE_ORANGE = '#f97316';
const GOOMBA_BODY = '#8b4513';
const GOOMBA_FEET = '#5c2d0e';
const KOOPA_BODY = '#22c55e';
const KOOPA_SHELL = '#15803d';
const COIN_COLOR = '#fbbf24';
const FLAG_POLE_COLOR = '#94a3b8';
const FLAG_COLOR = '#ef4444';
const DEBRIS_COLOR = '#a0522d';

const CATEGORY_COLORS: Record<string, { accent: string; qIcon: string }> = {
  backend:      { accent: '#f97316', qIcon: '🍄' },
  distributed:  { accent: '#06b6d4', qIcon: '🚇' },
  genai:        { accent: '#a855f7', qIcon: '🤖' },
  platform:     { accent: '#14b8a6', qIcon: '🛠' },
  architecture: { accent: '#eab308', qIcon: '🏰' },
  leadership:   { accent: '#f43f5e', qIcon: '⭐' },
};

export class MarioRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvasW: number;
  private canvasH: number;
  private frameCount = 0;
  private categoryKey = 'backend';
  private levelType: Level['levelType'] = 'ground';

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    this.canvasW = canvas.width;
    this.canvasH = canvas.height;
    this.ctx.imageSmoothingEnabled = false;
  }

  setCategory(cat: string): void {
    this.categoryKey = cat;
  }

  setLevelType(levelType: Level['levelType']): void {
    this.levelType = levelType;
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

    this.drawBackdrop(camX);
    this.drawCategoryBanner(level.category);

    this.ctx.save();
    this.ctx.translate(-camX, -camY);

    for (const p of level.platforms) {
      if (!p.destroyed) this.drawPlatform(p);
    }
    for (const qb of level.questionBlocks) this.drawQuestionBlock(qb);
    for (const coin of level.coins) this.drawCoin(coin);
    for (const enemy of level.enemies) this.drawEnemy(enemy);
    for (const fb of level.fireballs) this.drawFireball(fb);
    for (const d of level.debris) this.drawDebris(d);
    for (const ft of level.floatingTexts) this.drawFloatingText(ft);
    this.drawFlagPole(level.flagPole);
    this.drawPlayer(player);

    this.ctx.restore();
  }

  private drawBackdrop(camX: number): void {
    if (this.levelType === 'sky') {
      this.drawSkyStage(camX);
      return;
    }
    if (this.levelType === 'water') {
      this.drawWaterStage(camX);
      return;
    }
    this.drawSky();
    this.drawClouds(camX);
  }

  private drawSky(): void {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvasH);
    grad.addColorStop(0, SKY_TOP);
    grad.addColorStop(1, SKY_BOT);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);

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

  private drawSkyStage(camX: number): void {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvasH);
    grad.addColorStop(0, SKY_STAGE_TOP);
    grad.addColorStop(1, SKY_STAGE_BOT);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);

    this.ctx.fillStyle = 'rgba(255,255,255,0.9)';
    this.ctx.beginPath();
    this.ctx.arc(this.canvasW - 90, 70, 26, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (let i = 0; i < 10; i++) {
      const cx = (i * 210 + 80 - camX * 0.35) % (this.canvasW + 280) - 80;
      const cy = 55 + (i % 4) * 42;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      this.ctx.arc(cx + 20, cy - 8, 18, 0, Math.PI * 2);
      this.ctx.arc(cx + 40, cy, 24, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawWaterStage(camX: number): void {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvasH);
    grad.addColorStop(0, WATER_TOP);
    grad.addColorStop(1, WATER_BOT);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);

    this.ctx.strokeStyle = 'rgba(125,211,252,0.35)';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const waveY = 28 + i * 9;
      this.ctx.beginPath();
      for (let x = -40; x <= this.canvasW + 40; x += 18) {
        const y = waveY + Math.sin((x + camX * 0.25 + i * 22) * 0.03) * 4;
        if (x === -40) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.stroke();
    }

    this.ctx.fillStyle = 'rgba(186,230,253,0.3)';
    for (let i = 0; i < 22; i++) {
      const bx = (i * 97 + 30 - camX * 0.18) % (this.canvasW + 60) - 20;
      const by = 50 + (i * 37) % (this.canvasH - 80);
      const r = (i % 3) + 2;
      this.ctx.beginPath();
      this.ctx.arc(bx, by, r, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawCategoryBanner(category: string): void {
    const catCfg = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['backend'];
    const label = `${catCfg.qIcon} ${category.toUpperCase()} · ${this.levelType.toUpperCase()}`;
    this.ctx.save();
    this.ctx.globalAlpha = 0.4;
    this.ctx.fillStyle = catCfg.accent;
    this.ctx.font = '10px "Press Start 2P", monospace';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(label, this.canvasW - 8, 8);
    this.ctx.restore();
  }

  private drawPlatform(p: Platform): void {
    if (p.type === 'ground') {
      const topColor = this.levelType === 'sky' ? SKY_GROUND_TOP : this.levelType === 'water' ? WATER_GROUND_TOP : GROUND_TOP;
      const sideColor = this.levelType === 'sky' ? SKY_GROUND_SIDE : this.levelType === 'water' ? WATER_GROUND_SIDE : GROUND_SIDE;
      this.ctx.fillStyle = topColor;
      this.ctx.fillRect(p.x, p.y, p.w, TILE * 0.3);
      this.ctx.fillStyle = sideColor;
      this.ctx.fillRect(p.x, p.y + TILE * 0.3, p.w, p.h - TILE * 0.3);
      this.ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      this.ctx.lineWidth = 1;
      for (let tx = p.x; tx < p.x + p.w; tx += TILE) {
        this.ctx.strokeRect(tx, p.y, TILE, p.h);
      }
    } else if (p.type === 'brick') {
      const catCfg = CATEGORY_COLORS[this.categoryKey] ?? CATEGORY_COLORS['backend'];
      this.ctx.fillStyle = BRICK_FILL;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      this.ctx.strokeStyle = BRICK_LINE;
      this.ctx.lineWidth = 1;
      for (let tx = p.x; tx < p.x + p.w; tx += TILE) {
        for (let ty = p.y; ty < p.y + p.h; ty += TILE) {
          this.ctx.strokeRect(tx + 1, ty + 1, TILE - 2, TILE - 2);
          this.ctx.fillStyle = BRICK_LINE;
          this.ctx.fillRect(tx + TILE / 2 - 0.5, ty, 1, TILE);
          this.ctx.fillRect(tx, ty + TILE / 2 - 0.5, TILE, 1);
          this.ctx.fillStyle = BRICK_FILL;
        }
      }

      if (p.label && p.w >= TILE * 2) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.75;
        this.ctx.fillStyle = catCfg.accent;
        const fontSize = Math.min(7, Math.floor(p.w / (p.label.length * 4.5)));
        this.ctx.font = `${Math.max(5, fontSize)}px "Press Start 2P", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText(p.label, p.x + p.w / 2, p.y - 3);
        this.ctx.restore();
      }
    } else if (p.type === 'pipe') {
      this.ctx.fillStyle = PIPE_FILL;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      this.ctx.fillStyle = PIPE_DARK;
      this.ctx.fillRect(p.x, p.y, 4, p.h);
      this.ctx.fillRect(p.x + p.w - 4, p.y, 4, p.h);
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

      if (qb.keyword) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '5px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(qb.keyword, qb.x + qb.w / 2, qb.y + qb.h + 2);
        this.ctx.restore();
      }
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
      this.ctx.fillStyle = GOOMBA_BODY;
      this.ctx.fillRect(enemy.x + 2, enemy.y + enemy.h * (1 - squash), enemy.w - 4, enemy.h * squash);
      if (enemy.alive) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(enemy.x + enemy.w * 0.25, enemy.y + enemy.h * 0.2, 5, 5);
        this.ctx.fillRect(enemy.x + enemy.w * 0.6, enemy.y + enemy.h * 0.2, 5, 5);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(enemy.x + enemy.w * 0.3, enemy.y + enemy.h * 0.25, 3, 3);
        this.ctx.fillRect(enemy.x + enemy.w * 0.65, enemy.y + enemy.h * 0.25, 3, 3);
      }
      this.ctx.fillStyle = GOOMBA_FEET;
      this.ctx.fillRect(enemy.x, enemy.y + enemy.h - 4, enemy.w * 0.35, 4);
      this.ctx.fillRect(enemy.x + enemy.w * 0.65, enemy.y + enemy.h - 4, enemy.w * 0.35, 4);

      // Bug keyword label under enemy
      if (enemy.alive && enemy.keyword) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.45;
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = '5px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(enemy.keyword, enemy.x + enemy.w / 2, enemy.y + enemy.h + 2);
        this.ctx.restore();
      }
    } else {
      this.ctx.fillStyle = KOOPA_SHELL;
      this.ctx.fillRect(enemy.x + 2, enemy.y + enemy.h * 0.3, enemy.w - 4, enemy.h * 0.5);
      this.ctx.fillStyle = KOOPA_BODY;
      this.ctx.fillRect(enemy.x + enemy.w * 0.3, enemy.y, enemy.w * 0.4, enemy.h * 0.35);
      if (enemy.alive) {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(enemy.x + enemy.w * 0.35, enemy.y + 4, 4, 4);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(enemy.x + enemy.w * 0.38, enemy.y + 5, 2, 2);
      }

      if (enemy.alive && enemy.keyword) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.45;
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = '5px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(enemy.keyword, enemy.x + enemy.w / 2, enemy.y + enemy.h + 2);
        this.ctx.restore();
      }
    }

    this.ctx.globalAlpha = 1;
  }

  private drawFireball(fb: Fireball): void {
    if (!fb.alive) return;
    this.ctx.save();

    const pulse = 0.8 + Math.sin(this.frameCount * 0.3) * 0.2;
    const radius = (fb.w / 2) * pulse;

    // Glow
    this.ctx.shadowColor = FIRE_ORANGE;
    this.ctx.shadowBlur = 8;

    // Outer
    this.ctx.fillStyle = FIRE_ORANGE;
    this.ctx.beginPath();
    this.ctx.arc(fb.x + fb.w / 2, fb.y + fb.h / 2, radius + 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Inner core
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.beginPath();
    this.ctx.arc(fb.x + fb.w / 2, fb.y + fb.h / 2, radius * 0.6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.restore();
  }

  private drawFlagPole(fp: FlagPole): void {
    this.ctx.fillStyle = FLAG_POLE_COLOR;
    this.ctx.fillRect(fp.x + TILE * 0.1, fp.y, TILE * 0.1, fp.h);

    this.ctx.fillStyle = '#fbbf24';
    this.ctx.beginPath();
    this.ctx.arc(fp.x + TILE * 0.15, fp.y, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = FLAG_COLOR;
    this.ctx.beginPath();
    this.ctx.moveTo(fp.x + TILE * 0.2, fp.y + 4);
    this.ctx.lineTo(fp.x + TILE * 0.2 + 24, fp.y + 14);
    this.ctx.lineTo(fp.x + TILE * 0.2, fp.y + 24);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawDebris(d: Debris): void {
    if (!d.alive) return;
    this.ctx.save();
    this.ctx.globalAlpha = d.life / 30;
    this.ctx.fillStyle = DEBRIS_COLOR;
    this.ctx.fillRect(d.x - 4, d.y - 4, 8, 8);
    this.ctx.strokeStyle = BRICK_LINE;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(d.x - 4, d.y - 4, 8, 8);
    this.ctx.restore();
  }

  private drawFloatingText(ft: FloatingText): void {
    if (!ft.alive) return;
    this.ctx.save();
    this.ctx.globalAlpha = Math.min(1, ft.life / (ft.maxLife * 0.3));
    this.ctx.fillStyle = ft.color;
    this.ctx.font = '8px "Press Start 2P", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';

    this.ctx.shadowColor = 'rgba(0,0,0,0.7)';
    this.ctx.shadowBlur = 3;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.ctx.fillText(ft.text, ft.x + TILE / 2, ft.y);
    this.ctx.restore();
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
    const isFire = player.state === 'fire';

    const hatColor = isFire ? PLAYER_WHITE : PLAYER_RED;
    const bodyColor = isFire ? PLAYER_WHITE : PLAYER_RED;
    const overallColor = isFire ? FIRE_ORANGE : PLAYER_BLUE;

    this.ctx.save();
    if (flip) {
      this.ctx.translate(x + w, y);
      this.ctx.scale(-1, 1);
    } else {
      this.ctx.translate(x, y);
    }

    const isSmall = player.state === 'small';
    const headH = isSmall ? h * 0.45 : h * 0.3;
    const bodyH = isSmall ? h * 0.35 : h * 0.45;
    const legH = h - headH - bodyH;

    // Hat
    this.ctx.fillStyle = hatColor;
    this.ctx.fillRect(w * 0.15, 0, w * 0.7, headH * 0.4);
    this.ctx.fillRect(w * 0.05, headH * 0.4, w * 0.9, headH * 0.2);

    // Face
    this.ctx.fillStyle = PLAYER_SKIN;
    this.ctx.fillRect(w * 0.15, headH * 0.5, w * 0.7, headH * 0.5);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(w * 0.55, headH * 0.55, 3, 3);

    // Body / overalls
    this.ctx.fillStyle = bodyColor;
    this.ctx.fillRect(w * 0.1, headH, w * 0.8, bodyH * 0.3);
    this.ctx.fillStyle = overallColor;
    this.ctx.fillRect(w * 0.15, headH + bodyH * 0.3, w * 0.7, bodyH * 0.7);

    // Arms
    this.ctx.fillStyle = PLAYER_SKIN;
    const armW = w * 0.15;
    this.ctx.fillRect(-armW + 2, headH + 2, armW, bodyH * 0.5);
    this.ctx.fillRect(w - 2, headH + 2, armW, bodyH * 0.5);

    // Legs
    this.ctx.fillStyle = overallColor;
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
