import {
  TILE, GRAVITY, JUMP_FORCE, MOVE_SPEED, MAX_FALL,
  Player, Platform, Enemy, Coin, Fireball, FlagPole, QuestionBlock,
  FloatingText, Debris, CATEGORY_KEYWORDS, CATEGORY_BUG_KEYWORDS,
} from './mario-entities';

describe('mario-entities', () => {
  describe('constants', () => {
    it('exposes the documented tuning constants', () => {
      expect(TILE).toBe(32);
      expect(GRAVITY).toBeGreaterThan(0);
      expect(JUMP_FORCE).toBeLessThan(0);
      expect(MOVE_SPEED).toBeGreaterThan(0);
      expect(MAX_FALL).toBeGreaterThan(0);
    });
  });

  describe('Player', () => {
    it('initialises at the given position with default stats', () => {
      const p = new Player(10, 20);
      expect(p.x).toBe(10);
      expect(p.y).toBe(20);
      expect(p.lives).toBe(3);
      expect(p.coins).toBe(0);
      expect(p.score).toBe(0);
      expect(p.state).toBe('small');
      expect(p.facing).toBe('right');
      expect(p.onGround).toBeFalse();
      expect(p.isBig).toBeFalse();
    });

    it('exposes a bounding box that tracks position', () => {
      const p = new Player(5, 7);
      expect(p.box).toEqual({ x: 5, y: 7, w: p.w, h: p.h });
    });

    it('grows from small to big, taller and shifted up', () => {
      const p = new Player(0, 100);
      const startH = p.h;
      p.grow();
      expect(p.state).toBe('big');
      expect(p.h).toBeGreaterThan(startH);
      expect(p.y).toBe(100 - TILE * 0.5);
      expect(p.isBig).toBeTrue();
    });

    it('grows from big to fire without changing size', () => {
      const p = new Player(0, 100);
      p.grow();
      const h = p.h;
      p.grow();
      expect(p.state).toBe('fire');
      expect(p.h).toBe(h);
      expect(p.isBig).toBeTrue();
    });

    it('does nothing extra when growing past fire', () => {
      const p = new Player(0, 0);
      p.grow();
      p.grow();
      p.grow();
      expect(p.state).toBe('fire');
    });

    it('shrinks from fire to big and grants invincibility', () => {
      const p = new Player(0, 0);
      p.grow();
      p.grow(); // fire
      p.shrink();
      expect(p.state).toBe('big');
      expect(p.invincibleTimer).toBe(90);
    });

    it('shrinks from big to small, resetting height and position', () => {
      const p = new Player(0, 100);
      p.grow(); // big, y -= 16
      const bigY = p.y;
      p.shrink();
      expect(p.state).toBe('small');
      expect(p.h).toBe(TILE);
      expect(p.y).toBe(bigY + TILE * 0.5);
      expect(p.invincibleTimer).toBe(90);
    });

    it('ignores shrink when already small', () => {
      const p = new Player(0, 0);
      p.shrink();
      expect(p.state).toBe('small');
      expect(p.invincibleTimer).toBe(0);
    });

    it('activates the star timer', () => {
      const p = new Player(0, 0);
      p.activateStar();
      expect(p.starTimer).toBe(300);
    });
  });

  describe('Platform', () => {
    it('stores geometry and defaults', () => {
      const plat = new Platform(1, 2, 3, 4, 'brick');
      expect(plat.type).toBe('brick');
      expect(plat.hit).toBeFalse();
      expect(plat.destroyed).toBeFalse();
      expect(plat.box).toEqual({ x: 1, y: 2, w: 3, h: 4 });
    });
  });

  describe('Enemy', () => {
    it('moves left and slower as a goomba', () => {
      const g = new Enemy(0, 0, 'goomba');
      expect(g.vx).toBe(-1);
      expect(g.alive).toBeTrue();
    });

    it('moves faster as a koopa', () => {
      const k = new Enemy(0, 0, 'koopa');
      expect(k.vx).toBe(-1.5);
    });

    it('exposes a bounding box', () => {
      const e = new Enemy(8, 9, 'goomba');
      expect(e.box.x).toBe(8);
      expect(e.box.y).toBe(9);
    });
  });

  describe('Coin', () => {
    it('starts uncollected with a box', () => {
      const c = new Coin(4, 5);
      expect(c.collected).toBeFalse();
      expect(c.box).toEqual({ x: 4, y: 5, w: c.w, h: c.h });
    });
  });

  describe('Fireball', () => {
    it('moves right with positive direction', () => {
      const fb = new Fireball(0, 0, 1);
      expect(fb.vx).toBeGreaterThan(0);
      expect(fb.alive).toBeTrue();
      expect(fb.life).toBe(180);
    });

    it('moves left with negative direction', () => {
      const fb = new Fireball(0, 0, -1);
      expect(fb.vx).toBeLessThan(0);
      expect(fb.box.x).toBe(0);
    });
  });

  describe('FlagPole', () => {
    it('builds a thin tall box', () => {
      const fp = new FlagPole(100, 10, 200);
      expect(fp.box.x).toBe(100);
      expect(fp.box.h).toBe(200);
      expect(fp.box.w).toBeCloseTo(TILE * 0.3);
    });
  });

  describe('QuestionBlock', () => {
    it('defaults to a coin reward and question type', () => {
      const qb = new QuestionBlock(0, 0);
      expect(qb.reward).toBe('coin');
      expect(qb.type).toBe('question');
      expect(qb.hit).toBeFalse();
    });

    it('accepts an explicit reward', () => {
      const qb = new QuestionBlock(0, 0, 'star');
      expect(qb.reward).toBe('star');
    });
  });

  describe('FloatingText', () => {
    it('is alive until life ticks to zero and drifts upward', () => {
      const ft = new FloatingText(0, 100, 'hi', '#fff', 2);
      expect(ft.alive).toBeTrue();
      ft.tick();
      expect(ft.y).toBeLessThan(100);
      ft.tick();
      expect(ft.alive).toBeFalse();
    });

    it('uses default colour and life', () => {
      const ft = new FloatingText(0, 0, 'x');
      expect(ft.color).toBe('#fff');
      expect(ft.maxLife).toBe(60);
    });
  });

  describe('Debris', () => {
    it('moves with velocity and accelerates downward', () => {
      const d = new Debris(0, 0, 2, -5);
      const startVy = d.vy;
      d.tick();
      expect(d.x).toBe(2);
      expect(d.vy).toBeGreaterThan(startVy);
      expect(d.alive).toBeTrue();
    });

    it('dies after its life expires', () => {
      const d = new Debris(0, 0, 0, 0);
      for (let i = 0; i < 30; i++) d.tick();
      expect(d.alive).toBeFalse();
    });
  });

  describe('keyword tables', () => {
    it('provides keyword pools for every category', () => {
      for (const cat of Object.keys(CATEGORY_KEYWORDS)) {
        expect(CATEGORY_KEYWORDS[cat]!.length).toBeGreaterThan(0);
        expect(CATEGORY_BUG_KEYWORDS[cat]!.length).toBeGreaterThan(0);
      }
    });
  });
});
