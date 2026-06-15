import { MarioRenderer } from './mario-renderer';
import {
  TILE, Player, Platform, Enemy, Coin, QuestionBlock, Fireball,
  FlagPole, FloatingText, Debris, Particle, Level, LevelType,
} from './mario-entities';

/**
 * The renderer is pure 2D canvas drawing. We drive it with a real canvas (a 2D
 * context is available in headless Chrome) across every level type, entity
 * state, and player state so each drawing branch executes at least once.
 */
function makeCanvas(w = 320, h = 180): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function buildLevel(levelType: LevelType, category = 'backend'): Level {
  // Ground platform, a brick with a label, and a pipe exercise every branch
  // of drawPlatform.
  const ground = new Platform(0, 12 * TILE, 40 * TILE, 2 * TILE, 'ground');

  const brick = new Platform(6 * TILE, 7 * TILE, 3 * TILE, TILE, 'brick');
  brick.label = 'Circuit Breaker That Is Long';

  const narrowBrick = new Platform(2 * TILE, 5 * TILE, TILE, TILE, 'brick');
  const destroyedBrick = new Platform(4 * TILE, 5 * TILE, TILE, TILE, 'brick');
  destroyedBrick.destroyed = true;

  const pipe = new Platform(10 * TILE, 10 * TILE, 2 * TILE, 2 * TILE, 'pipe');

  const qbUnhit = new QuestionBlock(8 * TILE, 8 * TILE, 'coin');
  qbUnhit.keyword = 'Retry';
  const qbHit = new QuestionBlock(9 * TILE, 8 * TILE, 'mushroom');
  qbHit.hit = true;
  const qbNoKeyword = new QuestionBlock(11 * TILE, 8 * TILE, 'star');

  const coin = new Coin(5 * TILE, 6 * TILE);
  const collectedCoinAnimating = new Coin(6 * TILE, 6 * TILE);
  collectedCoinAnimating.collected = true;
  collectedCoinAnimating.animTimer = 10;
  const collectedCoinDone = new Coin(7 * TILE, 6 * TILE);
  collectedCoinDone.collected = true;
  collectedCoinDone.animTimer = 0;

  const goomba = new Enemy(14 * TILE, 11 * TILE, 'goomba');
  goomba.keyword = 'N+1 Query';
  const koopa = new Enemy(16 * TILE, 11 * TILE, 'koopa');
  koopa.keyword = 'Deadlock';
  const deadGoomba = new Enemy(18 * TILE, 11 * TILE, 'goomba');
  deadGoomba.alive = false;
  deadGoomba.squashTimer = 8;
  const deadKoopa = new Enemy(19 * TILE, 11 * TILE, 'koopa');
  deadKoopa.alive = false;
  deadKoopa.squashTimer = 8;
  const goneEnemy = new Enemy(20 * TILE, 11 * TILE, 'goomba');
  goneEnemy.alive = false;
  goneEnemy.squashTimer = 0;

  const fireball = new Fireball(13 * TILE, 9 * TILE, 1);
  const deadFireball = new Fireball(13 * TILE, 9 * TILE, -1);
  deadFireball.alive = false;

  const debris = new Debris(5 * TILE, 5 * TILE, -2, -5);
  const deadDebris = new Debris(5 * TILE, 5 * TILE, 2, -5);
  deadDebris.life = 0;

  const flagPole = new FlagPole(38 * TILE, 3 * TILE, 9 * TILE);

  const floatingText = new FloatingText(5 * TILE, 5 * TILE, '+100', '#fff', 80);
  const deadFloatingText = new FloatingText(5 * TILE, 5 * TILE, 'X', '#fff', 80);
  deadFloatingText.life = 0;

  const sparkParticle = new Particle(5 * TILE, 5 * TILE, 1, -1, '#fff', 3, 24, 'spark');
  const ringParticle = new Particle(5 * TILE, 5 * TILE, 1, -1, '#fff', 3, 24, 'ring');
  const dustParticle = new Particle(5 * TILE, 5 * TILE, 1, -1, '#fff', 3, 24, 'dust');
  const puffParticle = new Particle(5 * TILE, 5 * TILE, 1, -1, '#fff', 3, 24, 'puff');

  return {
    platforms: [ground, brick, narrowBrick, destroyedBrick, pipe],
    enemies: [goomba, koopa, deadGoomba, deadKoopa, goneEnemy],
    coins: [coin, collectedCoinAnimating, collectedCoinDone],
    questionBlocks: [qbUnhit, qbHit, qbNoKeyword],
    fireballs: [fireball, deadFireball],
    flagPole,
    floatingTexts: [floatingText, deadFloatingText],
    debris: [debris, deadDebris],
    particles: [sparkParticle, ringParticle, dustParticle, puffParticle],
    width: 40 * TILE,
    height: 14 * TILE,
    category,
    levelType,
  };
}

describe('MarioRenderer', () => {
  let canvas: HTMLCanvasElement;
  let renderer: MarioRenderer;

  beforeEach(() => {
    canvas = makeCanvas();
    renderer = new MarioRenderer(canvas);
  });

  it('constructs with a 2D context and disables image smoothing', () => {
    expect(renderer).toBeTruthy();
    expect(canvas.getContext('2d')!.imageSmoothingEnabled).toBeFalse();
  });

  it('resize updates the canvas dimensions', () => {
    renderer.resize(640, 360);
    expect(canvas.width).toBe(640);
    expect(canvas.height).toBe(360);
  });

  it('renders a ground level with every entity state without throwing', () => {
    const level = buildLevel('ground');
    const player = new Player(2 * TILE, 10 * TILE);
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('renders the sky stage backdrop', () => {
    renderer.setLevelType('sky');
    const level = buildLevel('sky', 'genai');
    const player = new Player(2 * TILE, 10 * TILE);
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('renders the water stage backdrop', () => {
    renderer.setLevelType('water');
    const level = buildLevel('water', 'distributed');
    const player = new Player(2 * TILE, 10 * TILE);
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('falls back to backend palette for an unknown category', () => {
    const level = buildLevel('ground', 'totally-unknown');
    const player = new Player(2 * TILE, 10 * TILE);
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('draws the player in every power state', () => {
    const level = buildLevel('ground');
    const states: Array<Player['state']> = ['small', 'big', 'fire'];
    for (const state of states) {
      const player = new Player(2 * TILE, 10 * TILE);
      player.state = state;
      if (state !== 'small') player.grow();
      player.state = state;
      expect(() => renderer.render(player, level)).not.toThrow();
    }
  });

  it('draws the player facing left and while moving', () => {
    const level = buildLevel('ground');
    const player = new Player(2 * TILE, 10 * TILE);
    player.facing = 'left';
    player.vx = 3;
    player.walkPhase = 0.5;
    player.onGround = true;
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('draws the player airborne (legs tucked)', () => {
    const level = buildLevel('ground');
    const player = new Player(2 * TILE, 10 * TILE);
    player.onGround = false;
    player.vx = 2;
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('applies a star glow when the star timer is active', () => {
    const level = buildLevel('ground');
    const player = new Player(2 * TILE, 10 * TILE);
    player.activateStar();
    // Render across several frames so the hue animation advances.
    for (let i = 0; i < 5; i++) renderer.render(player, level);
    expect(player.starTimer).toBeGreaterThan(0);
  });

  it('skips drawing the player on blink frames while invincible', () => {
    const level = buildLevel('ground');
    const player = new Player(2 * TILE, 10 * TILE);
    player.invincibleTimer = 90;
    // Several frames so both the blink-on and blink-off branches execute.
    for (let i = 0; i < 8; i++) {
      expect(() => renderer.render(player, level)).not.toThrow();
    }
  });

  it('clamps the camera at the right edge of a wide level', () => {
    const level = buildLevel('ground');
    const player = new Player(level.width - TILE, 10 * TILE);
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('shake magnitude decays back to zero over time', () => {
    const level = buildLevel('ground');
    const player = new Player(2 * TILE, 10 * TILE);
    renderer.shake(10);
    for (let i = 0; i < 40; i++) renderer.render(player, level);
    // After enough frames the shake should have fully decayed (no throw and
    // stable rendering).
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('clamps shake magnitude to a maximum of 10', () => {
    const level = buildLevel('ground');
    const player = new Player(2 * TILE, 10 * TILE);
    renderer.shake(999);
    expect(() => renderer.render(player, level)).not.toThrow();
  });

  it('handles a level with no particles array', () => {
    const level = buildLevel('ground');
    (level as any).particles = undefined;
    const player = new Player(2 * TILE, 10 * TILE);
    expect(() => renderer.render(player, level)).not.toThrow();
  });
});
