import { MarioEngine, GameCallbacks } from './mario-engine';
import { generateProceduralLevel } from './mario-level-generator';
import {
  TILE, Enemy, QuestionBlock, Platform, Level,
} from './mario-entities';
import { CollisionResult } from './mario-physics';

function makeCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 180;
  return canvas;
}

function makeCallbacks(): GameCallbacks & {
  deaths: number; wins: number; scores: Array<[number, number, number]>;
} {
  const state = {
    deaths: 0,
    wins: 0,
    scores: [] as Array<[number, number, number]>,
    onDeath: () => { state.deaths++; },
    onWin: () => { state.wins++; },
    onScoreChange: (s: number, c: number, l: number) => { state.scores.push([s, c, l]); },
  };
  return state;
}

function emptyResult(): CollisionResult {
  return {
    hitQuestionBlock: null,
    hitEnemy: null,
    stompedEnemy: null,
    fireballKilledEnemies: [],
    firedFireball: false,
    brickBroken: null,
    brickBumped: null,
    reachedFlag: false,
    died: false,
    jumped: false,
    coinCollected: false,
  };
}

describe('MarioEngine', () => {
  let canvas: HTMLCanvasElement;
  let cbs: ReturnType<typeof makeCallbacks>;
  let engine: MarioEngine;

  beforeEach(() => {
    canvas = makeCanvas();
    cbs = makeCallbacks();
    engine = new MarioEngine(canvas, cbs);
  });

  afterEach(() => {
    engine.stop();
  });

  it('constructs with a player and idle state', () => {
    expect(engine.player).toBeTruthy();
    expect(engine.getState()).toBe('idle');
    expect(engine.getControls()).toBeTruthy();
  });

  it('resize delegates to the renderer without throwing', () => {
    expect(() => engine.resize(640, 360)).not.toThrow();
  });

  it('loadLevel resets player, counters, and category keywords', () => {
    const level = generateProceduralLevel({ difficulty: 'Easy', category: 'genai', levelType: 'ground' });
    engine.player.score = 999;
    engine.enemiesStomped = 5;
    engine.loadLevel(level);
    expect(engine.level).toBe(level);
    expect(engine.player.score).toBe(0);
    expect(engine.enemiesStomped).toBe(0);
    expect(engine.elapsedFrames).toBe(0);
    expect(engine.getState()).toBe('idle');
  });

  it('falls back to backend keywords for an unknown category', () => {
    const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
    level.category = 'nope';
    expect(() => engine.loadLevel(level)).not.toThrow();
  });

  it('start does nothing when no level is loaded', () => {
    engine.start();
    expect(engine.getState()).toBe('idle');
  });

  it('start runs the loop and stop halts it', () => {
    const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
    engine.loadLevel(level);
    engine.start();
    expect(engine.getState()).toBe('running');
    engine.stop();
    expect(engine.getState()).toBe('idle');
  });

  it('pause and resume toggle state correctly', () => {
    const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
    engine.loadLevel(level);
    engine.start();
    engine.pause();
    expect(engine.getState()).toBe('paused');
    engine.resume();
    expect(engine.getState()).toBe('running');
  });

  it('resume is a no-op when not paused', () => {
    const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
    engine.loadLevel(level);
    engine.resume();
    expect(engine.getState()).toBe('idle');
  });

  describe('collision handling', () => {
    let level: Level;

    beforeEach(() => {
      level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
      engine.loadLevel(level);
    });

    function handle(result: Partial<CollisionResult>): void {
      (engine as any).handleCollisionResult({ ...emptyResult(), ...result });
    }

    it('handles coin pickup audio cue', () => {
      expect(() => handle({ coinCollected: true, jumped: true, firedFireball: true })).not.toThrow();
    });

    it('handles a coin reward question block', () => {
      const qb = new QuestionBlock(5 * TILE, 8 * TILE, 'coin');
      qb.keyword = 'Retry';
      handle({ hitQuestionBlock: qb });
      expect(engine.player.coins).toBe(3);
      expect(engine.player.score).toBe(50);
      expect(level.floatingTexts.length).toBeGreaterThan(0);
    });

    it('handles a mushroom reward (grows small player)', () => {
      const qb = new QuestionBlock(5 * TILE, 8 * TILE, 'mushroom');
      handle({ hitQuestionBlock: qb });
      expect(engine.player.state).toBe('big');
      expect(engine.player.score).toBe(100);
    });

    it('handles a mushroom reward when already big', () => {
      engine.player.grow();
      const qb = new QuestionBlock(5 * TILE, 8 * TILE, 'mushroom');
      handle({ hitQuestionBlock: qb });
      expect(engine.player.state).toBe('fire');
    });

    it('handles a star reward', () => {
      const qb = new QuestionBlock(5 * TILE, 8 * TILE, 'star');
      handle({ hitQuestionBlock: qb });
      expect(engine.player.starTimer).toBeGreaterThan(0);
      expect(engine.player.score).toBe(200);
    });

    it('uses a generated keyword when the question block has none', () => {
      const qb = new QuestionBlock(5 * TILE, 8 * TILE, 'coin');
      handle({ hitQuestionBlock: qb });
      const text = level.floatingTexts[level.floatingTexts.length - 1]!;
      expect(text.text.length).toBeGreaterThan(0);
    });

    it('handles a brick break with a label', () => {
      const brick = new Platform(5 * TILE, 5 * TILE, 2 * TILE, TILE, 'brick');
      brick.label = 'Rate Limit';
      handle({ brickBroken: brick });
      expect(level.debris.length).toBe(4);
      expect(level.floatingTexts.some(t => t.text === 'Rate Limit')).toBeTrue();
    });

    it('handles a brick break without a label', () => {
      const brick = new Platform(5 * TILE, 5 * TILE, 2 * TILE, TILE, 'brick');
      handle({ brickBroken: brick });
      expect(level.debris.length).toBe(4);
    });

    it('handles a brick bump', () => {
      const brick = new Platform(5 * TILE, 5 * TILE, 2 * TILE, TILE, 'brick');
      expect(() => handle({ brickBumped: brick })).not.toThrow();
    });

    it('shrinks a fire player when hit by an enemy', () => {
      engine.player.grow();
      engine.player.grow(); // fire
      const enemy = new Enemy(5 * TILE, 11 * TILE, 'goomba');
      handle({ hitEnemy: enemy });
      expect(engine.player.state).toBe('big');
    });

    it('shrinks a big player when hit by an enemy', () => {
      engine.player.grow(); // big
      const enemy = new Enemy(5 * TILE, 11 * TILE, 'goomba');
      handle({ hitEnemy: enemy });
      expect(engine.player.state).toBe('small');
    });

    it('loses a life (but survives) when a small player is hit with lives remaining', () => {
      const enemy = new Enemy(5 * TILE, 11 * TILE, 'goomba');
      handle({ hitEnemy: enemy });
      expect(engine.player.lives).toBe(2);
      expect(engine.player.invincibleTimer).toBe(90);
      expect(cbs.deaths).toBe(0);
    });

    it('triggers death when a small player is hit with the last life', () => {
      engine.player.lives = 1;
      const enemy = new Enemy(5 * TILE, 11 * TILE, 'goomba');
      handle({ hitEnemy: enemy });
      expect(cbs.deaths).toBe(1);
      expect(engine.getState()).toBe('lost');
    });

    it('counts a stomped enemy and emits keyword + particles', () => {
      const enemy = new Enemy(5 * TILE, 11 * TILE, 'goomba');
      enemy.keyword = 'N+1 Query';
      handle({ stompedEnemy: enemy });
      expect(engine.enemiesStomped).toBe(1);
      expect(level.particles.length).toBeGreaterThan(0);
      expect(level.floatingTexts.some(t => t.text.includes('N+1 Query'))).toBeTrue();
    });

    it('handles fireball-killed enemies', () => {
      const e1 = new Enemy(5 * TILE, 11 * TILE, 'goomba');
      const e2 = new Enemy(6 * TILE, 11 * TILE, 'koopa');
      handle({ fireballKilledEnemies: [e1, e2] });
      expect(engine.enemiesStomped).toBe(2);
    });

    it('respawns the player when died with lives remaining', () => {
      engine.player.grow();
      handle({ died: true });
      expect(engine.player.lives).toBe(2);
      expect(engine.player.state).toBe('small');
      expect(engine.player.invincibleTimer).toBe(120);
      expect(cbs.deaths).toBe(0);
    });

    it('triggers death when died with the last life', () => {
      engine.player.lives = 1;
      handle({ died: true });
      expect(cbs.deaths).toBe(1);
      expect(engine.getState()).toBe('lost');
    });

    it('handles reaching the flag with a time bonus and win callback', () => {
      engine.elapsedFrames = 60;
      handle({ reachedFlag: true });
      expect(cbs.wins).toBe(1);
      expect(engine.getState()).toBe('won');
      expect(engine.player.score).toBeGreaterThan(0);
    });
  });

  describe('tick & particle lifecycle', () => {
    it('advances frames and culls dead particles on tick', () => {
      const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
      engine.loadLevel(level);
      (engine as any).state = 'running';
      const startFrames = engine.elapsedFrames;
      (engine as any).tick();
      expect(engine.elapsedFrames).toBe(startFrames + 1);
    });

    it('tick is a no-op when not running', () => {
      const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
      engine.loadLevel(level);
      const startFrames = engine.elapsedFrames;
      (engine as any).tick();
      expect(engine.elapsedFrames).toBe(startFrames);
    });

    it('emits landing dust when landing hard', () => {
      const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
      engine.loadLevel(level);
      (engine as any).wasOnGround = false;
      (engine as any).prevVy = 8;
      engine.player.onGround = true;
      (engine as any).handleLandingAndDust();
      expect(level.particles.length).toBeGreaterThan(0);
    });

    it('emits a running dust trail', () => {
      const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'ground' });
      engine.loadLevel(level);
      engine.player.onGround = true;
      engine.player.running = true;
      engine.player.vx = 4;
      engine.elapsedFrames = 5;
      (engine as any).handleLandingAndDust();
      expect(level.particles.length).toBeGreaterThan(0);
    });

    it('emits a flight flutter trail when flying', () => {
      const level = generateProceduralLevel({ difficulty: 'Easy', category: 'backend', levelType: 'sky' });
      engine.loadLevel(level);
      engine.player.flying = true;
      engine.elapsedFrames = 3;
      (engine as any).handleLandingAndDust();
      expect(level.particles.length).toBeGreaterThan(0);
    });
  });
});
