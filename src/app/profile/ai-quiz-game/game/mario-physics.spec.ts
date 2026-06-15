import { updatePhysics } from './mario-physics';
import {
  TILE, JUMP_FORCE, MAX_FALL,
  Player, Platform, Enemy, Coin, Fireball, FlagPole, QuestionBlock, Level,
} from './mario-entities';

function makeLevel(overrides: Partial<Level> = {}): Level {
  return {
    platforms: [],
    enemies: [],
    coins: [],
    questionBlocks: [],
    fireballs: [],
    flagPole: new FlagPole(10_000, 0, TILE),
    floatingTexts: [],
    debris: [],
    particles: [],
    width: 4000,
    height: 1000,
    category: 'backend',
    levelType: 'ground',
    ...overrides,
  };
}

const NO_KEYS = { left: false, right: false, jump: false, fire: false, run: false };

describe('updatePhysics', () => {
  describe('horizontal movement', () => {
    it('moves right and sets facing', () => {
      const p = new Player(100, 100);
      updatePhysics(p, makeLevel(), { ...NO_KEYS, right: true });
      expect(p.facing).toBe('right');
      expect(p.x).toBeGreaterThan(100);
    });

    it('moves left and sets facing', () => {
      const p = new Player(100, 100);
      updatePhysics(p, makeLevel(), { ...NO_KEYS, left: true });
      expect(p.facing).toBe('left');
      expect(p.x).toBeLessThan(100);
    });

    it('applies friction and clamps tiny velocities to zero', () => {
      const p = new Player(100, 100);
      p.vx = 0.1;
      updatePhysics(p, makeLevel(), NO_KEYS);
      expect(p.vx).toBe(0);
    });

    it('clamps the player inside the left edge', () => {
      const p = new Player(0, 100);
      p.vx = -10;
      updatePhysics(p, makeLevel(), { ...NO_KEYS, left: true });
      expect(p.x).toBe(0);
    });

    it('clamps the player inside the right edge', () => {
      const level = makeLevel({ width: 200 });
      const p = new Player(180, 100);
      updatePhysics(p, level, { ...NO_KEYS, right: true });
      expect(p.x).toBeLessThanOrEqual(200 - p.w);
    });
  });

  describe('jumping and gravity', () => {
    it('jumps when on the ground', () => {
      const p = new Player(100, 100);
      p.onGround = true;
      const res = updatePhysics(p, makeLevel(), { ...NO_KEYS, jump: true });
      expect(res.jumped).toBeTrue();
      expect(p.onGround).toBeFalse();
    });

    it('does not jump in mid-air', () => {
      const p = new Player(100, 100);
      p.onGround = false;
      const res = updatePhysics(p, makeLevel(), { ...NO_KEYS, jump: true });
      expect(res.jumped).toBeFalse();
    });

    it('accelerates downward via gravity', () => {
      const p = new Player(100, 100);
      const before = p.vy;
      updatePhysics(p, makeLevel(), NO_KEYS);
      expect(p.vy).toBeGreaterThan(before);
    });

    it('caps the fall speed at MAX_FALL', () => {
      const p = new Player(100, 100);
      p.vy = 999;
      updatePhysics(p, makeLevel(), NO_KEYS);
      expect(p.vy).toBeLessThanOrEqual(MAX_FALL);
    });
  });

  describe('water levels', () => {
    it('lets the player swim upward on jump with a stroke cooldown', () => {
      const level = makeLevel({ levelType: 'water' });
      const p = new Player(100, 100);
      const res = updatePhysics(p, level, { ...NO_KEYS, jump: true });
      expect(res.jumped).toBeTrue();
      expect(p.swimStrokeCooldown).toBe(10);
    });

    it('blocks a second stroke until cooldown elapses', () => {
      const level = makeLevel({ levelType: 'water' });
      const p = new Player(100, 100);
      p.swimStrokeCooldown = 5;
      const res = updatePhysics(p, level, { ...NO_KEYS, jump: true });
      expect(res.jumped).toBeFalse();
      expect(p.swimStrokeCooldown).toBe(4);
    });
  });

  describe('platform collisions', () => {
    it('lands on a platform and becomes grounded', () => {
      const ground = new Platform(0, 200, 400, TILE * 2, 'ground');
      const level = makeLevel({ platforms: [ground] });
      const p = new Player(100, 200 - TILE - 1);
      p.vy = 5;
      updatePhysics(p, level, NO_KEYS);
      expect(p.onGround).toBeTrue();
      expect(p.vy).toBe(0);
      expect(p.y).toBe(200 - p.h);
    });

    it('stops horizontal motion when hitting a wall', () => {
      const wall = new Platform(150, 0, TILE, TILE * 10, 'pipe');
      const level = makeLevel({ platforms: [wall] });
      const p = new Player(150 - p_width(), 0);
      p.vx = MOVE_SPEED_FALLBACK();
      updatePhysics(p, level, { ...NO_KEYS, right: true });
      expect(p.vx).toBe(0);
    });
  });

  describe('question blocks', () => {
    it('is triggered when bumped from below', () => {
      const qb = new QuestionBlock(100, 100);
      const level = makeLevel({ questionBlocks: [qb] });
      const p = new Player(100, 100 + TILE + 1);
      p.vy = -5;
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.hitQuestionBlock).toBe(qb);
      expect(qb.hit).toBeTrue();
    });
  });

  describe('bricks', () => {
    it('breaks a brick when the player is big', () => {
      const brick = new Platform(100, 100, TILE * 2, TILE, 'brick');
      const level = makeLevel({ platforms: [brick] });
      const p = new Player(100, 100 + TILE + 1);
      p.grow();
      p.vy = -5;
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.brickBroken).toBe(brick);
      expect(brick.destroyed).toBeTrue();
    });

    it('only bumps a brick when the player is small', () => {
      const brick = new Platform(100, 100, TILE * 2, TILE, 'brick');
      const level = makeLevel({ platforms: [brick] });
      const p = new Player(100, 100 + TILE + 1);
      p.vy = -5;
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.brickBumped).toBe(brick);
      expect(brick.destroyed).toBeFalse();
    });
  });

  describe('death by falling', () => {
    it('flags death when falling below the level', () => {
      const level = makeLevel({ height: 100 });
      const p = new Player(100, 250);
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.died).toBeTrue();
    });
  });

  describe('coins', () => {
    it('collects an overlapping coin', () => {
      const coin = new Coin(100, 100);
      const level = makeLevel({ coins: [coin] });
      const p = new Player(100, 100);
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.coinCollected).toBeTrue();
      expect(coin.collected).toBeTrue();
      expect(p.coins).toBe(1);
    });
  });

  describe('enemy collisions', () => {
    it('stomps an enemy when falling onto it', () => {
      const enemy = new Enemy(100, 150, 'goomba');
      const level = makeLevel({ enemies: [enemy] });
      const p = new Player(100, 150 - p_height() + 2);
      p.vy = 5;
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.stompedEnemy).toBe(enemy);
      expect(enemy.alive).toBeFalse();
      expect(p.vy).toBeCloseTo(JUMP_FORCE * 0.6, 1);
    });

    it('hurts the player on a side hit', () => {
      const enemy = new Enemy(100, 100, 'goomba');
      const level = makeLevel({ enemies: [enemy] });
      const p = new Player(100, 100);
      p.vy = 0;
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.hitEnemy).toBe(enemy);
    });

    it('ignores enemy contact while invincible', () => {
      const enemy = new Enemy(100, 100, 'goomba');
      const level = makeLevel({ enemies: [enemy] });
      const p = new Player(100, 100);
      p.vy = 0;
      p.invincibleTimer = 60;
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.hitEnemy).toBeNull();
    });

    it('destroys enemies on contact while a star is active', () => {
      const enemy = new Enemy(100, 100, 'goomba');
      const level = makeLevel({ enemies: [enemy] });
      const p = new Player(100, 100);
      p.activateStar();
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.stompedEnemy).toBe(enemy);
      expect(enemy.alive).toBeFalse();
    });
  });

  describe('fireballs', () => {
    it('spawns a fireball when firing in fire state', () => {
      const level = makeLevel();
      const p = new Player(100, 100);
      p.grow();
      p.grow(); // fire
      const res = updatePhysics(p, level, { ...NO_KEYS, fire: true });
      expect(res.firedFireball).toBeTrue();
      expect(level.fireballs.length).toBe(1);
    });

    it('does not fire when not in fire state', () => {
      const level = makeLevel();
      const p = new Player(100, 100);
      const res = updatePhysics(p, level, { ...NO_KEYS, fire: true });
      expect(res.firedFireball).toBeFalse();
    });

    it('a fireball kills an enemy it touches', () => {
      const enemy = new Enemy(120, 100, 'goomba');
      const fb = new Fireball(120, 100, 1);
      const level = makeLevel({ enemies: [enemy], fireballs: [fb] });
      const p = new Player(0, 100);
      const res = updatePhysics(p, level, NO_KEYS);
      expect(enemy.alive).toBeFalse();
      expect(res.fireballKilledEnemies).toContain(enemy);
    });

    it('expires a fireball when its life runs out', () => {
      const fb = new Fireball(100, 100, 1);
      fb.life = 1;
      const level = makeLevel({ fireballs: [fb] });
      const p = new Player(0, 100);
      updatePhysics(p, level, NO_KEYS);
      expect(level.fireballs.length).toBe(0);
    });
  });

  describe('enemy movement', () => {
    it('moves living enemies horizontally', () => {
      const enemy = new Enemy(500, 150, 'goomba');
      const ground = new Platform(0, 150 + enemy.h, 1000, TILE, 'ground');
      const level = makeLevel({ enemies: [enemy], platforms: [ground] });
      const p = new Player(0, 100);
      const startX = enemy.x;
      updatePhysics(p, level, NO_KEYS);
      expect(enemy.x).not.toBe(startX);
    });

    it('counts down the squash timer for dead enemies', () => {
      const enemy = new Enemy(500, 150, 'goomba');
      enemy.alive = false;
      enemy.squashTimer = 5;
      const level = makeLevel({ enemies: [enemy] });
      const p = new Player(0, 100);
      updatePhysics(p, level, NO_KEYS);
      expect(enemy.squashTimer).toBe(4);
    });
  });

  describe('flag pole', () => {
    it('reports reaching the flag', () => {
      const flag = new FlagPole(100, 80, TILE * 4);
      const level = makeLevel({ flagPole: flag });
      const p = new Player(100, 100);
      const res = updatePhysics(p, level, NO_KEYS);
      expect(res.reachedFlag).toBeTrue();
    });
  });

  describe('timers', () => {
    it('decrements invincible and star timers', () => {
      const p = new Player(100, 100);
      p.invincibleTimer = 10;
      p.starTimer = 10;
      updatePhysics(p, makeLevel(), NO_KEYS);
      expect(p.invincibleTimer).toBe(9);
      expect(p.starTimer).toBe(9);
    });
  });
});

// helpers kept readable without importing Player internals repeatedly
function p_width(): number { return TILE * 0.75; }
function p_height(): number { return TILE; }
function MOVE_SPEED_FALLBACK(): number { return 3.8; }
