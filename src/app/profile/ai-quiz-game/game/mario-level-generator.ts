import { TILE, Platform, Enemy, Coin, QuestionBlock, FlagPole, Level, Player, PowerUpType } from './mario-entities';

const LEVEL_TILES_WIDE = 80;
const GROUND_ROW = 12;
const LEVEL_ROWS = 14;

export interface LevelConfig {
  difficulty: string;
}

function assignRewards(count: number): PowerUpType[] {
  const rewards: PowerUpType[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    if (roll < 0.15) rewards.push('star');
    else if (roll < 0.45) rewards.push('mushroom');
    else rewards.push('coin');
  }
  return rewards;
}

interface RawLevelData {
  platforms?: { x: number; y: number; width: number; type?: string }[];
  questionBlocks?: { x: number; y: number }[];
  enemies?: { x: number; y: number; type?: string }[];
  coins?: { x: number; y: number }[];
  flagPole?: { x: number };
}

export function parseLevelFromAI(raw: string): RawLevelData | null {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const data = JSON.parse(jsonMatch[0]);
    if (data.platforms && Array.isArray(data.platforms)) return data;
    return null;
  } catch {
    return null;
  }
}

export function buildLevelFromData(data: RawLevelData, config: LevelConfig): Level {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const coins: Coin[] = [];
  const questionBlocks: QuestionBlock[] = [];

  const levelW = LEVEL_TILES_WIDE * TILE;
  const levelH = LEVEL_ROWS * TILE;

  if (data.platforms) {
    for (const p of data.platforms) {
      const type = (p.type === 'brick' || p.type === 'pipe' || p.type === 'ground') ? p.type : 'ground';
      platforms.push(new Platform(
        p.x * TILE, p.y * TILE,
        (p.width || 1) * TILE, TILE * (type === 'ground' ? 2 : 1),
        type as any
      ));
    }
  }

  if (data.questionBlocks) {
    const rewards = assignRewards(data.questionBlocks.length);
    data.questionBlocks.forEach((qb, i) => {
      questionBlocks.push(new QuestionBlock(qb.x * TILE, qb.y * TILE, rewards[i]));
    });
  }

  if (data.enemies) {
    for (const e of data.enemies) {
      const type = e.type === 'koopa' ? 'koopa' : 'goomba';
      enemies.push(new Enemy(e.x * TILE, e.y * TILE, type as any));
    }
  }

  if (data.coins) {
    for (const c of data.coins) {
      coins.push(new Coin(c.x * TILE, c.y * TILE));
    }
  }

  const flagX = data.flagPole?.x ? data.flagPole.x * TILE : (LEVEL_TILES_WIDE - 4) * TILE;
  const flagPole = new FlagPole(flagX, 3 * TILE, (GROUND_ROW - 3) * TILE);

  return { platforms, enemies, coins, questionBlocks, flagPole, width: levelW, height: levelH };
}

export function generateProceduralLevel(config: LevelConfig): Level {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const coins: Coin[] = [];
  const questionBlocks: QuestionBlock[] = [];

  const levelW = LEVEL_TILES_WIDE * TILE;
  const levelH = LEVEL_ROWS * TILE;
  const gY = GROUND_ROW * TILE;

  // Build ground with gaps
  const gapChance = config.difficulty === 'Hard' ? 0.12 : config.difficulty === 'Medium' ? 0.07 : 0.04;
  let groundStart = 0;

  for (let tx = 0; tx < LEVEL_TILES_WIDE; tx++) {
    const isEnd = tx >= LEVEL_TILES_WIDE - 6;
    const isStart = tx < 6;
    const makeGap = !isStart && !isEnd && Math.random() < gapChance;

    if (makeGap) {
      if (tx > groundStart) {
        platforms.push(new Platform(groundStart * TILE, gY, (tx - groundStart) * TILE, 2 * TILE, 'ground'));
      }
      const gapW = Math.random() < 0.3 ? 3 : 2;
      tx += gapW;
      groundStart = tx;
    }
  }
  if (groundStart < LEVEL_TILES_WIDE) {
    platforms.push(new Platform(groundStart * TILE, gY, (LEVEL_TILES_WIDE - groundStart) * TILE, 2 * TILE, 'ground'));
  }

  // Floating brick platforms
  const brickCount = config.difficulty === 'Hard' ? 8 : config.difficulty === 'Medium' ? 6 : 4;
  for (let i = 0; i < brickCount; i++) {
    const bx = 8 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 16));
    const by = 6 + Math.floor(Math.random() * 4);
    const bw = 2 + Math.floor(Math.random() * 4);
    platforms.push(new Platform(bx * TILE, by * TILE, bw * TILE, TILE, 'brick'));
  }

  // Question blocks with power-up rewards
  const qCount = config.difficulty === 'Hard' ? 5 : config.difficulty === 'Medium' ? 7 : 9;
  const spacing = Math.floor((LEVEL_TILES_WIDE - 12) / (qCount + 1));
  const rewards = assignRewards(qCount);
  for (let i = 0; i < qCount; i++) {
    const qx = 6 + spacing * (i + 1) + Math.floor(Math.random() * 3 - 1);
    const qy = 7 + Math.floor(Math.random() * 2);
    questionBlocks.push(new QuestionBlock(qx * TILE, qy * TILE, rewards[i]));
  }

  // Enemies
  const enemyCount = config.difficulty === 'Hard' ? 10 : config.difficulty === 'Medium' ? 7 : 4;
  for (let i = 0; i < enemyCount; i++) {
    const ex = 10 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 20));
    const ey = GROUND_ROW - 1;
    const type = Math.random() < 0.3 ? 'koopa' : 'goomba';
    enemies.push(new Enemy(ex * TILE, ey * TILE, type as any));
  }

  // Coins
  const coinCount = config.difficulty === 'Hard' ? 20 : config.difficulty === 'Medium' ? 15 : 10;
  for (let i = 0; i < coinCount; i++) {
    const cx = 5 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 10));
    const cy = 4 + Math.floor(Math.random() * 7);
    coins.push(new Coin(cx * TILE + TILE * 0.25, cy * TILE + TILE * 0.25));
  }

  // Pipes
  const pipeCount = config.difficulty === 'Hard' ? 4 : 2;
  for (let i = 0; i < pipeCount; i++) {
    const px = 15 + Math.floor(i * (LEVEL_TILES_WIDE - 20) / (pipeCount + 1));
    const ph = (2 + Math.floor(Math.random() * 2)) * TILE;
    platforms.push(new Platform(px * TILE, gY - ph, TILE * 2, ph, 'pipe'));
  }

  const flagPole = new FlagPole((LEVEL_TILES_WIDE - 4) * TILE, 3 * TILE, (GROUND_ROW - 3) * TILE);

  return { platforms, enemies, coins, questionBlocks, flagPole, width: levelW, height: levelH };
}

export function createPlayer(): Player {
  return new Player(3 * TILE, (GROUND_ROW - 1) * TILE - TILE);
}

export function getLevelGenerationPrompt(category: string, difficulty: string): string {
  const qCount = difficulty === 'Hard' ? 5 : difficulty === 'Medium' ? 7 : 9;
  const enemyGuide = difficulty === 'Hard' ? '8-12' : difficulty === 'Medium' ? '5-8' : '3-5';
  const gapGuide = difficulty === 'Hard' ? '3-4 gaps (2-3 tiles wide)' : difficulty === 'Medium' ? '2-3 gaps (2 tiles wide)' : '1-2 small gaps';

  return `Generate a Mario-style platform level layout as JSON for a ${category}-themed ${difficulty} difficulty challenge.

The level is on a grid: 80 tiles wide, 14 tiles tall. Row 0 is the top, row 12 is the ground surface.
The player starts at tile (3, 11). The flag pole should be at tile x=76.

Requirements for ${difficulty} difficulty:
- Ground segments with ${gapGuide}
- ${qCount} question blocks (power-up blocks) placed at rows 7-9 (above ground, hittable from below)
- ${enemyGuide} enemies (goomba or koopa) placed at row 11 (on ground)
- 15-30 coins scattered at rows 4-10
- 3-6 floating brick platforms (2-4 tiles wide) at rows 6-9
- 1-3 pipes on the ground (2 tiles wide)

Return ONLY valid JSON in this exact format:
{
  "platforms": [{"x": 0, "y": 12, "width": 10, "type": "ground"}, {"x": 20, "y": 7, "width": 3, "type": "brick"}],
  "questionBlocks": [{"x": 15, "y": 8}],
  "enemies": [{"x": 25, "y": 11, "type": "goomba"}],
  "coins": [{"x": 12, "y": 6}],
  "flagPole": {"x": 76}
}

All coordinates are in tile units (not pixels). Ground should start at y=12 and gaps should be realistic (2-3 tiles). Make sure the level is playable - no impossible jumps.`;
}
