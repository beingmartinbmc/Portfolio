import { TILE, Platform, Enemy, Coin, QuestionBlock, FlagPole, Level, Player, PowerUpType, FloatingText, Debris, LevelType, CATEGORY_KEYWORDS, CATEGORY_BUG_KEYWORDS } from './mario-entities';

const LEVEL_TILES_WIDE = 96;
const GROUND_ROW = 12;
const LEVEL_ROWS = 14;
const PLAYER_START_X = 3;
const PLAYER_START_Y = GROUND_ROW - 1;
const FLAG_POLE_X = LEVEL_TILES_WIDE - 4;
const SAFE_START_END_X = 7;
const SAFE_FINISH_START_X = FLAG_POLE_X - 3;

interface RangeGuide {
  min: number;
  max: number;
}

interface EnemyZoneGuide {
  label: string;
  start: number;
  end: number;
  min: number;
  max: number;
  koopaChance: number;
  note: string;
  requireKoopa?: boolean;
}

interface LayoutGuide {
  pipeCount: RangeGuide;
  brickCount: RangeGuide;
  questionCount: RangeGuide;
  enemyCount: RangeGuide;
  coinCount: RangeGuide;
  gapCount: RangeGuide;
  maxGapWidth: number;
  brickRows: RangeGuide;
  questionRows: RangeGuide;
  coinRows: RangeGuide;
  enemyZones: EnemyZoneGuide[];
}

export interface LevelValidationResult {
  valid: boolean;
  issues: string[];
}

function getGuideLabel(range: RangeGuide): string {
  return range.min === range.max ? `${range.min}` : `${range.min}-${range.max}`;
}

function getTargetCount(range: RangeGuide): number {
  return Math.round((range.min + range.max) / 2);
}

function inRange(value: number, range: RangeGuide): boolean {
  return value >= range.min && value <= range.max;
}

function normalizePlatformType(type?: string): 'ground' | 'pipe' | 'brick' {
  return type === 'brick' || type === 'pipe' || type === 'ground' ? type : 'ground';
}

function resolveLevelType(levelType?: string): LevelType {
  return levelType === 'sky' || levelType === 'water' || levelType === 'ground' ? levelType : 'ground';
}

function getLayoutGuide(difficulty: string, levelType: LevelType = 'ground'): LayoutGuide {
  let guide: LayoutGuide;
  if (difficulty === 'Hard') {
    guide = {
      pipeCount: { min: 4, max: 4 },
      brickCount: { min: 8, max: 10 },
      questionCount: { min: 5, max: 7 },
      enemyCount: { min: 20, max: 24 },
      coinCount: { min: 30, max: 38 },
      gapCount: { min: 4, max: 5 },
      maxGapWidth: 3,
      brickRows: { min: 6, max: 9 },
      questionRows: { min: 7, max: 9 },
      coinRows: { min: 4, max: 10 },
      enemyZones: [
        { label: 'Zone 1', start: 8, end: 20, min: 3, max: 4, koopaChance: 0.2, note: 'warm-up wave with clear approaches' },
        { label: 'Zone 2', start: 22, end: 34, min: 3, max: 4, koopaChance: 0.25, note: 'ramp up with a few close pairs' },
        { label: 'Zone 3', start: 36, end: 48, min: 4, max: 5, koopaChance: 0.3, note: 'mid-level gauntlet, the densest section' },
        { label: 'Zone 4', start: 50, end: 62, min: 3, max: 4, koopaChance: 0.35, note: 'second wave after a brief breather' },
        { label: 'Zone 5', start: 64, end: 76, min: 3, max: 4, koopaChance: 0.4, note: 'late pressure with mixed types' },
        { label: 'Zone 6', start: 78, end: 88, min: 3, max: 4, koopaChance: 0.55, note: 'final push before the flag', requireKoopa: true },
      ],
    };
  } else if (difficulty === 'Medium') {
    guide = {
      pipeCount: { min: 3, max: 3 },
      brickCount: { min: 6, max: 8 },
      questionCount: { min: 7, max: 9 },
      enemyCount: { min: 14, max: 18 },
      coinCount: { min: 26, max: 34 },
      gapCount: { min: 3, max: 4 },
      maxGapWidth: 3,
      brickRows: { min: 6, max: 9 },
      questionRows: { min: 7, max: 9 },
      coinRows: { min: 4, max: 10 },
      enemyZones: [
        { label: 'Zone 1', start: 8, end: 20, min: 2, max: 2, koopaChance: 0.15, note: 'warm-up, readable spacing' },
        { label: 'Zone 2', start: 22, end: 34, min: 2, max: 3, koopaChance: 0.2, note: 'light ramp with one intentional pair' },
        { label: 'Zone 3', start: 36, end: 48, min: 3, max: 4, koopaChance: 0.25, note: 'mid-level pressure zone' },
        { label: 'Zone 4', start: 50, end: 62, min: 2, max: 3, koopaChance: 0.3, note: 'short breather then second wave' },
        { label: 'Zone 5', start: 64, end: 76, min: 2, max: 3, koopaChance: 0.35, note: 'late challenge, still fair' },
        { label: 'Zone 6', start: 78, end: 88, min: 2, max: 3, koopaChance: 0.45, note: 'final push with at least one koopa', requireKoopa: true },
      ],
    };
  } else {
    guide = {
      pipeCount: { min: 2, max: 3 },
      brickCount: { min: 4, max: 6 },
      questionCount: { min: 8, max: 10 },
      enemyCount: { min: 9, max: 12 },
      coinCount: { min: 22, max: 30 },
      gapCount: { min: 2, max: 3 },
      maxGapWidth: 2,
      brickRows: { min: 6, max: 9 },
      questionRows: { min: 7, max: 9 },
      coinRows: { min: 4, max: 10 },
      enemyZones: [
        { label: 'Zone 1', start: 8, end: 20, min: 1, max: 2, koopaChance: 0.1, note: 'gentle opening with wide spacing' },
        { label: 'Zone 2', start: 22, end: 34, min: 1, max: 2, koopaChance: 0.15, note: 'small ramp, still forgiving' },
        { label: 'Zone 3', start: 36, end: 48, min: 2, max: 3, koopaChance: 0.2, note: 'mid-level challenge, readable groupings' },
        { label: 'Zone 4', start: 50, end: 62, min: 1, max: 2, koopaChance: 0.25, note: 'short second wave' },
        { label: 'Zone 5', start: 64, end: 76, min: 2, max: 2, koopaChance: 0.3, note: 'late challenge without crowding' },
        { label: 'Zone 6', start: 78, end: 88, min: 1, max: 2, koopaChance: 0.35, note: 'easy final push before the flag' },
      ],
    };
  }

  if (levelType === 'sky') {
    return {
      ...guide,
      pipeCount: { min: 0, max: 0 },
      brickCount: { min: guide.brickCount.min + 2, max: guide.brickCount.max + 3 },
      questionCount: { min: guide.questionCount.min + 1, max: guide.questionCount.max + 1 },
      coinCount: { min: guide.coinCount.min + 4, max: guide.coinCount.max + 6 },
      gapCount: { min: Math.max(guide.gapCount.min, 3), max: guide.gapCount.max + 1 },
      brickRows: { min: 4, max: 7 },
      questionRows: { min: 5, max: 8 },
      coinRows: { min: 2, max: 8 },
      enemyZones: guide.enemyZones.map(zone => ({ ...zone, note: `${zone.note}; emphasize elevated jumps between platforms` })),
    };
  }

  if (levelType === 'water') {
    return {
      ...guide,
      pipeCount: { min: 0, max: 0 },
      brickCount: { min: guide.brickCount.min + 1, max: guide.brickCount.max + 2 },
      questionCount: { min: guide.questionCount.min, max: guide.questionCount.max + 1 },
      coinCount: { min: guide.coinCount.min + 2, max: guide.coinCount.max + 4 },
      gapCount: { min: 0, max: 0 },
      maxGapWidth: 0,
      brickRows: { min: 7, max: 10 },
      questionRows: { min: 6, max: 9 },
      coinRows: { min: 5, max: 10 },
      enemyZones: guide.enemyZones.map(zone => ({ ...zone, note: `${zone.note}; leave more open water to swim through` })),
    };
  }

  return guide;
}

function getLevelTypePrompt(levelType: LevelType): string {
  if (levelType === 'sky') {
    return 'Sky stage: floating platforms, airy jumps, sparse ground, and lots of vertical coin trails. Keep the route readable and fun to hop across.';
  }
  if (levelType === 'water') {
    return 'Water stage: underwater course with a swimmable route, continuous seabed, low-to-mid platforms, and dense coin trails that reward exploration. Avoid giant pits and keep room to swim.';
  }
  return 'Ground stage: classic Mario overworld with solid footing, staged gaps, and a balanced mix of ground hazards and platforming.';
}

export interface LevelConfig {
  difficulty: string;
  category?: string;
  levelType?: LevelType;
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

function shuffleKeywords(pool: string[]): string[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick a keyword from the (shuffled) pool that has not been used yet. When the
 * pool is smaller than the number of enemies, fall back to a numbered suffix so
 * every keyword stays unique — the level validator requires distinct enemy
 * keywords.
 */
function uniqueKeyword(pool: string[], index: number, used: Set<string>): string {
  const base = pool[index % pool.length];
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate)) {
    candidate = `${base} ${suffix}`;
    suffix++;
  }
  used.add(candidate);
  return candidate;
}

interface RawLevelData {
  levelType?: string;
  platforms?: { x: number; y: number; width: number; type?: string; label?: string }[];
  questionBlocks?: { x: number; y: number; keyword?: string; reward?: string }[];
  enemies?: { x: number; y: number; type?: string; keyword?: string }[];
  coins?: { x: number; y: number }[];
  flagPole?: { x: number };
}

function markCoveredTiles(tiles: boolean[], startX: number, width: number): void {
  const from = Math.max(0, Math.floor(startX));
  const to = Math.min(tiles.length, Math.ceil(startX + Math.max(1, width)));
  for (let tx = from; tx < to; tx++) {
    tiles[tx] = true;
  }
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

export function validateAILevelData(data: RawLevelData, config: LevelConfig): LevelValidationResult {
  // Validate the AI output against the requested config first; a level that
  // declares a different levelType than was asked for is a mismatch.
  const levelType = resolveLevelType(config.levelType ?? data.levelType);
  const guide = getLayoutGuide(config.difficulty, levelType);
  const issues: string[] = [];
  const platforms = data.platforms ?? [];
  const questionBlocks = data.questionBlocks ?? [];
  const enemies = data.enemies ?? [];
  const coins = data.coins ?? [];
  const groundTiles = new Array(LEVEL_TILES_WIDE).fill(false);
  const pipeTiles = new Array(LEVEL_TILES_WIDE).fill(false);
  const enemyKeywords = new Set<string>();
  const zoneCounts = guide.enemyZones.map(() => 0);
  const requiredKoopas = guide.enemyZones.map(() => 0);
  let pipeCount = 0;
  let brickCount = 0;

  if (data.levelType && data.levelType !== levelType) {
    issues.push(`levelType must be "${levelType}".`);
  }

  for (const p of platforms) {
    const width = Math.max(1, Math.floor(p.width || 1));
    const type = normalizePlatformType(p.type);
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(width)) {
      issues.push('Every platform must have finite x, y, and width values.');
      continue;
    }
    if (p.x < 0 || p.y < 0 || p.y >= LEVEL_ROWS || p.x + width > LEVEL_TILES_WIDE) {
      issues.push(`Platform ${type} at (${p.x}, ${p.y}) is out of bounds.`);
    }
    if (type === 'ground' && p.y === GROUND_ROW) {
      markCoveredTiles(groundTiles, p.x, width);
    }
    if (type === 'pipe') {
      pipeCount++;
      markCoveredTiles(pipeTiles, p.x, width);
      if (p.x <= SAFE_START_END_X || p.x >= SAFE_FINISH_START_X) {
        issues.push(`Pipe at x=${p.x} is inside a protected start/finish zone.`);
      }
    }
    if (type === 'brick') {
      brickCount++;
      if (!p.label) {
        issues.push(`Brick platform at (${p.x}, ${p.y}) is missing a label.`);
      }
      if (!inRange(p.y, guide.brickRows)) {
        issues.push(`Brick platform at y=${p.y} is outside the allowed brick rows.`);
      }
    }
  }

  for (let tx = 0; tx <= SAFE_START_END_X; tx++) {
    if (!groundTiles[tx]) {
      issues.push('The start zone must be flat ground with no gaps.');
      break;
    }
  }

  for (let tx = SAFE_FINISH_START_X; tx < FLAG_POLE_X; tx++) {
    if (!groundTiles[tx]) {
      issues.push('The finish approach must stay flat with no gaps.');
      break;
    }
  }

  let gapCount = 0;
  let gapStart = -1;
  for (let tx = SAFE_START_END_X + 1; tx < SAFE_FINISH_START_X; tx++) {
    if (!groundTiles[tx]) {
      if (gapStart === -1) gapStart = tx;
      continue;
    }
    if (gapStart !== -1) {
      gapCount++;
      if (tx - gapStart > guide.maxGapWidth) {
        issues.push(`Gap from x=${gapStart} to x=${tx - 1} is too wide for ${config.difficulty}.`);
      }
      gapStart = -1;
    }
  }
  if (gapStart !== -1) {
    gapCount++;
    if (SAFE_FINISH_START_X - gapStart > guide.maxGapWidth) {
      issues.push(`Gap from x=${gapStart} to x=${SAFE_FINISH_START_X - 1} is too wide for ${config.difficulty}.`);
    }
  }

  if (!inRange(pipeCount, guide.pipeCount)) {
    issues.push(`Pipe count ${pipeCount} is outside the ${config.difficulty} range ${getGuideLabel(guide.pipeCount)}.`);
  }
  if (!inRange(brickCount, guide.brickCount)) {
    issues.push(`Brick count ${brickCount} is outside the ${config.difficulty} range ${getGuideLabel(guide.brickCount)}.`);
  }
  if (!inRange(questionBlocks.length, guide.questionCount)) {
    issues.push(`Question block count ${questionBlocks.length} is outside the ${config.difficulty} range ${getGuideLabel(guide.questionCount)}.`);
  }
  if (!inRange(enemies.length, guide.enemyCount)) {
    issues.push(`Enemy count ${enemies.length} is outside the ${config.difficulty} range ${getGuideLabel(guide.enemyCount)}.`);
  }
  if (!inRange(coins.length, guide.coinCount)) {
    issues.push(`Coin count ${coins.length} is outside the ${config.difficulty} range ${getGuideLabel(guide.coinCount)}.`);
  }
  if (!inRange(gapCount, guide.gapCount)) {
    issues.push(`Gap count ${gapCount} is outside the ${config.difficulty} range ${getGuideLabel(guide.gapCount)}.`);
  }

  questionBlocks.forEach((qb) => {
    if (qb.x < 0 || qb.x >= LEVEL_TILES_WIDE || qb.y < 0 || qb.y >= LEVEL_ROWS) {
      issues.push(`Question block at (${qb.x}, ${qb.y}) is out of bounds.`);
    }
    if (!qb.keyword) {
      issues.push(`Question block at (${qb.x}, ${qb.y}) is missing a keyword.`);
    }
    if (!inRange(qb.y, guide.questionRows)) {
      issues.push(`Question block at y=${qb.y} is outside the allowed rows.`);
    }
  });

  coins.forEach((coin) => {
    if (coin.x < 0 || coin.x >= LEVEL_TILES_WIDE || coin.y < 0 || coin.y >= LEVEL_ROWS) {
      issues.push(`Coin at (${coin.x}, ${coin.y}) is out of bounds.`);
    }
    if (!inRange(coin.y, guide.coinRows)) {
      issues.push(`Coin at y=${coin.y} is outside the allowed rows.`);
    }
  });

  enemies.forEach((enemy) => {
    if (enemy.x < 0 || enemy.x >= LEVEL_TILES_WIDE || enemy.y < 0 || enemy.y >= LEVEL_ROWS) {
      issues.push(`Enemy at (${enemy.x}, ${enemy.y}) is out of bounds.`);
      return;
    }
    if (enemy.y !== GROUND_ROW - 1) {
      issues.push(`Enemy at x=${enemy.x} must be placed at y=${GROUND_ROW - 1}.`);
    }
    if (enemy.x <= SAFE_START_END_X || enemy.x >= SAFE_FINISH_START_X) {
      issues.push(`Enemy at x=${enemy.x} is inside a protected start/finish zone.`);
    }
    if (!groundTiles[Math.floor(enemy.x)]) {
      issues.push(`Enemy at x=${enemy.x} is not standing on ground.`);
    }
    if (pipeTiles[Math.floor(enemy.x)]) {
      issues.push(`Enemy at x=${enemy.x} overlaps a pipe footprint.`);
    }
    if (!enemy.keyword) {
      issues.push(`Enemy at x=${enemy.x} is missing a keyword.`);
    } else if (enemyKeywords.has(enemy.keyword)) {
      issues.push(`Enemy keyword "${enemy.keyword}" must be unique.`);
    } else {
      enemyKeywords.add(enemy.keyword);
    }

    const zoneIndex = guide.enemyZones.findIndex(zone => enemy.x >= zone.start && enemy.x <= zone.end);
    if (zoneIndex === -1) {
      issues.push(`Enemy at x=${enemy.x} is outside the allowed enemy zones.`);
      return;
    }

    zoneCounts[zoneIndex]++;
    if (guide.enemyZones[zoneIndex].requireKoopa && enemy.type === 'koopa') {
      requiredKoopas[zoneIndex]++;
    }
  });

  guide.enemyZones.forEach((zone, index) => {
    if (!inRange(zoneCounts[index], { min: zone.min, max: zone.max })) {
      issues.push(`${zone.label} enemy count ${zoneCounts[index]} is outside the expected ${zone.min}-${zone.max}.`);
    }
    if (zone.requireKoopa && requiredKoopas[index] === 0) {
      issues.push(`${zone.label} requires at least one koopa.`);
    }
  });

  if (data.flagPole?.x !== undefined && data.flagPole.x !== FLAG_POLE_X) {
    issues.push(`Flag pole must be placed at x=${FLAG_POLE_X}.`);
  }

  return { valid: issues.length === 0, issues };
}

export function buildLevelFromData(data: RawLevelData, config: LevelConfig): Level {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const coins: Coin[] = [];
  const questionBlocks: QuestionBlock[] = [];
  const category = config.category || 'backend';
  const levelType = resolveLevelType(data.levelType ?? config.levelType);
  const fallbackKw = shuffleKeywords(CATEGORY_KEYWORDS[category] ?? CATEGORY_KEYWORDS['backend']);
  const fallbackBug = shuffleKeywords(CATEGORY_BUG_KEYWORDS[category] ?? CATEGORY_BUG_KEYWORDS['backend']);
  let kwIdx = 0;
  let bugIdx = 0;

  const levelW = LEVEL_TILES_WIDE * TILE;
  const levelH = LEVEL_ROWS * TILE;

  if (data.platforms) {
    for (const p of data.platforms) {
      const type = normalizePlatformType(p.type);
      const plat = new Platform(
        p.x * TILE, p.y * TILE,
        (p.width || 1) * TILE, TILE * (type === 'ground' ? 2 : 1),
        type as any
      );
      if (type === 'brick') {
        plat.label = p.label || fallbackKw[kwIdx++ % fallbackKw.length];
      }
      platforms.push(plat);
    }
  }

  if (data.questionBlocks) {
    const fallbackRewards = assignRewards(data.questionBlocks.length);
    data.questionBlocks.forEach((qb, i) => {
      let reward: PowerUpType = fallbackRewards[i];
      if (qb.reward === 'star' || qb.reward === 'mushroom' || qb.reward === 'coin') {
        reward = qb.reward;
      }
      const q = new QuestionBlock(qb.x * TILE, qb.y * TILE, reward);
      q.keyword = qb.keyword || fallbackKw[kwIdx++ % fallbackKw.length];
      questionBlocks.push(q);
    });
  }

  if (data.enemies) {
    for (const e of data.enemies) {
      const type = e.type === 'koopa' ? 'koopa' : 'goomba';
      const enemy = new Enemy(e.x * TILE, e.y * TILE, type as any);
      enemy.keyword = e.keyword || fallbackBug[bugIdx++ % fallbackBug.length];
      enemies.push(enemy);
    }
  }

  if (data.coins) {
    for (const c of data.coins) {
      coins.push(new Coin(c.x * TILE, c.y * TILE));
    }
  }

  const flagX = data.flagPole?.x ? data.flagPole.x * TILE : FLAG_POLE_X * TILE;
  const flagPole = new FlagPole(flagX, 3 * TILE, (GROUND_ROW - 3) * TILE);

  return { platforms, enemies, coins, questionBlocks, fireballs: [], flagPole, floatingTexts: [], debris: [], particles: [], width: levelW, height: levelH, category, levelType };
}

export function generateProceduralLevel(config: LevelConfig): Level {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const coins: Coin[] = [];
  const questionBlocks: QuestionBlock[] = [];
  const category = config.category || 'backend';
  const levelType = resolveLevelType(config.levelType);
  const guide = getLayoutGuide(config.difficulty, levelType);
  const keywords = shuffleKeywords(CATEGORY_KEYWORDS[category] ?? CATEGORY_KEYWORDS['backend']);
  const bugKw = shuffleKeywords(CATEGORY_BUG_KEYWORDS[category] ?? CATEGORY_BUG_KEYWORDS['backend']);
  let kwIdx = 0;
  let bugIdx = 0;
  const usedBugKeywords = new Set<string>();

  const levelW = LEVEL_TILES_WIDE * TILE;
  const levelH = LEVEL_ROWS * TILE;
  const gY = GROUND_ROW * TILE;

  // Ground with gaps
  const targetGapCount = getTargetCount(guide.gapCount);
  const plannedGaps: { start: number; width: number }[] = [];
  const gapStartMin = SAFE_START_END_X + 5;
  const gapStartMax = SAFE_FINISH_START_X - 6;
  const gapSpacing = Math.floor((gapStartMax - gapStartMin) / Math.max(1, targetGapCount));

  for (let i = 0; i < targetGapCount; i++) {
    const width = guide.maxGapWidth > 2 && Math.random() < 0.35 ? 3 : 2;
    const jitter = Math.floor(Math.random() * 3) - 1;
    const rawStart = gapStartMin + i * gapSpacing + jitter;
    const previousGap = plannedGaps[plannedGaps.length - 1];
    const minStart = previousGap ? previousGap.start + previousGap.width + 6 : gapStartMin;
    const start = Math.min(Math.max(rawStart, minStart), gapStartMax - width);
    plannedGaps.push({ start, width });
  }

  let groundStart = 0;
  for (const gap of plannedGaps) {
    if (gap.start > groundStart) {
      platforms.push(new Platform(groundStart * TILE, gY, (gap.start - groundStart) * TILE, 2 * TILE, 'ground'));
    }
    groundStart = gap.start + gap.width;
  }
  if (groundStart < LEVEL_TILES_WIDE) {
    platforms.push(new Platform(groundStart * TILE, gY, (LEVEL_TILES_WIDE - groundStart) * TILE, 2 * TILE, 'ground'));
  }

  // Pipes
  const pipeCount = getTargetCount(guide.pipeCount);
  const pipePositions: number[] = [];
  const pipeSpacing = Math.floor((LEVEL_TILES_WIDE - 26) / (pipeCount + 1));
  for (let i = 0; i < pipeCount; i++) {
    const px = 12 + pipeSpacing * (i + 1);
    const ph = 2 * TILE;
    platforms.push(new Platform(px * TILE, gY - ph, TILE * 2, ph, 'pipe'));
    pipePositions.push(px);
  }

  const isNearPipe = (tx: number): boolean =>
    pipePositions.some(px => tx >= px - 2 && tx <= px + 3);

  const isOverGap = (tx: number): boolean =>
    plannedGaps.some(g => tx >= g.start && tx < g.start + g.width);

  // Floating brick platforms with category labels
  const brickCount = getTargetCount(guide.brickCount);
  for (let i = 0; i < brickCount; i++) {
    let bx: number;
    let attempts = 0;
    do { bx = 8 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 16)); attempts++; }
    while (isNearPipe(bx) && attempts < 20);
    const by = guide.brickRows.min + Math.floor(Math.random() * (guide.brickRows.max - guide.brickRows.min + 1));
    const bw = 2 + Math.floor(Math.random() * 3);
    const brick = new Platform(bx * TILE, by * TILE, bw * TILE, TILE, 'brick');
    brick.label = keywords[kwIdx % keywords.length];
    kwIdx++;
    platforms.push(brick);
  }

  if (levelType === 'sky' || levelType === 'water') {
    const accentCount = levelType === 'sky' ? 4 : 2;
    for (let i = 0; i < accentCount; i++) {
      const span = Math.floor((SAFE_FINISH_START_X - 16) / (accentCount + 1));
      const bx = 12 + span * (i + 1) + Math.floor(Math.random() * 3 - 1);
      const by = levelType === 'sky'
        ? Math.max(3, guide.brickRows.min - 1 + (i % 3))
        : Math.min(GROUND_ROW - 1, guide.brickRows.max - (i % 2));
      const bw = levelType === 'sky' ? 4 * TILE : 3 * TILE;
      const accentPlatform = new Platform(bx * TILE, by * TILE, bw, TILE, 'brick');
      accentPlatform.label = keywords[kwIdx % keywords.length];
      kwIdx++;
      platforms.push(accentPlatform);
    }
  }

  // Question blocks with category keywords
  const qCount = getTargetCount(guide.questionCount);
  const spacing = Math.floor((LEVEL_TILES_WIDE - 14) / (qCount + 1));
  const rewards = assignRewards(qCount);
  for (let i = 0; i < qCount; i++) {
    let qx = 6 + spacing * (i + 1) + Math.floor(Math.random() * 3 - 1);
    if (isNearPipe(qx)) qx += 4;
    const qy = guide.questionRows.min + Math.floor(Math.random() * (guide.questionRows.max - guide.questionRows.min + 1));
    const qb = new QuestionBlock(qx * TILE, qy * TILE, rewards[i]);
    qb.keyword = keywords[kwIdx % keywords.length];
    kwIdx++;
    questionBlocks.push(qb);
  }

  // Enemies in staged zones — progressively harder waves
  const zones = guide.enemyZones.map(zone => ({
    start: zone.start,
    end: zone.end,
    count: getTargetCount({ min: zone.min, max: zone.max }),
    koopaChance: zone.koopaChance,
    requireKoopa: zone.requireKoopa === true,
  }));

  zones.forEach((zone, zoneIndex) => {
    const zoneWidth = zone.end - zone.start;
    const step = Math.max(3, Math.floor(zoneWidth / (zone.count + 1)));
    let koopaPlaced = false;
    for (let i = 0; i < zone.count; i++) {
      let ex = zone.start + step * (i + 1) + Math.floor(Math.random() * 2 - 1);
      ex = Math.max(zone.start, Math.min(zone.end - 1, ex));
      if (isNearPipe(ex)) ex += 3;
      if (ex > zone.end) ex = zone.end - 2;
      // Never strand an enemy over a gap — nudge it onto solid ground.
      let gapGuard = 0;
      while (isOverGap(ex) && gapGuard < zoneWidth) {
        ex = Math.max(zone.start, Math.min(zone.end - 1, ex + 1));
        gapGuard++;
      }
      const mustUseKoopa = zone.requireKoopa && !koopaPlaced && i === zone.count - 1;
      const type = mustUseKoopa || Math.random() < zone.koopaChance ? 'koopa' : 'goomba';
      const enemy = new Enemy(ex * TILE, (GROUND_ROW - 1) * TILE, type as any);
      enemy.keyword = uniqueKeyword(bugKw, bugIdx, usedBugKeywords);
      bugIdx++;
      enemies.push(enemy);
      koopaPlaced = koopaPlaced || type === 'koopa';
    }
  });

  // Coins
  const coinCount = getTargetCount(guide.coinCount);
  for (let i = 0; i < coinCount; i++) {
    let cx: number;
    let attempts = 0;
    do { cx = 5 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 10)); attempts++; }
    while (isNearPipe(cx) && attempts < 15);
    const cy = guide.coinRows.min + Math.floor(Math.random() * (guide.coinRows.max - guide.coinRows.min + 1));
    coins.push(new Coin(cx * TILE + TILE * 0.25, cy * TILE + TILE * 0.25));
  }

  const flagPole = new FlagPole(FLAG_POLE_X * TILE, 3 * TILE, (GROUND_ROW - 3) * TILE);

  return { platforms, enemies, coins, questionBlocks, fireballs: [], flagPole, floatingTexts: [], debris: [], particles: [], width: levelW, height: levelH, category, levelType };
}

export function createPlayer(): Player {
  return new Player(PLAYER_START_X * TILE, PLAYER_START_Y * TILE - TILE);
}

const CATEGORY_DESCRIPTIONS: Record<string, { domain: string; techExamples: string; bugExamples: string }> = {
  backend: {
    domain: 'Backend Engineering — APIs, databases, caching, auth, service design',
    techExamples: 'REST API, Circuit Breaker, Connection Pool, Rate Limit, DB Index, gRPC, Middleware, ORM, Idempotent, Retry',
    bugExamples: 'N+1 Query, SQL Injection, Deadlock, Race Condition, Null Ref, Memory Leak, 500 Error, Auth Bypass, OOM, Stale Cache',
  },
  distributed: {
    domain: 'Distributed Systems — messaging, consistency, partitioning, resilience',
    techExamples: 'Kafka, Partition, Replication, Consensus, Raft, Shard, Quorum, Saga, Event Bus, Backpressure',
    bugExamples: 'Split Brain, Msg Lost, Data Skew, Hot Partition, Poison Pill, Dup Event, Clock Drift, Stale Read, Net Split, Zombie',
  },
  genai: {
    domain: 'Gen AI & LLM Systems — RAG, embeddings, prompts, agents, evaluation',
    techExamples: 'RAG, Embeddings, Vector DB, Prompt, Fine-tune, Token, Context Window, Agent, Tool Call, Guardrails',
    bugExamples: 'Hallucinate, Token Limit, Prompt Leak, Embed Drift, Eval Fail, Latency, Cost Spike, Loop Agent, Bad Chunk, Jailbreak',
  },
  platform: {
    domain: 'Platform Engineering — CI/CD, containers, observability, reliability',
    techExamples: 'CI/CD, k8s, Docker, Terraform, Grafana, Prometheus, SLO, Canary, Feature Flag, Service Mesh',
    bugExamples: 'OOM Kill, Pod Crash, Cert Expire, Drift, Flaky Test, Build Fail, Alert Noise, Rollback, DNS Fail, Quota Hit',
  },
  architecture: {
    domain: 'System Architecture — trade-offs, patterns, scale, fault tolerance',
    techExamples: 'Load Balancer, CDN, Cache, CQRS, Event Source, Microservice, API Gateway, BFF, Bounded Context, Bulkhead',
    bugExamples: 'Circular Dep, Tight Couple, God Class, Leaky Abstraction, Spaghetti, Bottleneck, Single Point, Tech Debt, Big Ball of Mud',
  },
  leadership: {
    domain: 'Staff Engineering & Leadership — influence, planning, execution, culture',
    techExamples: 'RFC, ADR, Tech Debt, Roadmap, Stakeholder, Postmortem, Mentoring, Code Review, OKR, Alignment',
    bugExamples: 'Scope Creep, Bikeshed, Silo, Bus Factor, Gold Plate, YAGNI, Cargo Cult, Burnout, Hero Code, Tunnel Vision',
  },
};

export function getLevelGenerationPrompt(category: string, difficulty: string, requestedLevelType: LevelType = 'ground'): string {
  const cat = CATEGORY_DESCRIPTIONS[category] ?? CATEGORY_DESCRIPTIONS['backend'];
  const levelType = resolveLevelType(requestedLevelType);
  const guide = getLayoutGuide(difficulty, levelType);
  const coursePrompt = getLevelTypePrompt(levelType);
  const zoneGuide = guide.enemyZones
    .map(zone => `   - ${zone.label} (x=${zone.start}-${zone.end}): ${zone.note}; ${zone.min}-${zone.max} enemies${zone.requireKoopa ? '; at least 1 koopa' : ''}`)
    .join('\n');

  return `You are a game level designer building a Mario-style platformer level for a "${cat.domain}" themed world at "${difficulty}" difficulty.

Your output will be checked by a strict validator. Generate a level that is fun, playable, and already satisfies the validation rules.

COURSE STYLE: "${levelType}"
${coursePrompt}

LAYOUT BLUEPRINT TO FOLLOW:
{
  "levelType": "${levelType}",
  "grid": { "width": ${LEVEL_TILES_WIDE}, "height": ${LEVEL_ROWS}, "groundRow": ${GROUND_ROW}, "playerStart": { "x": ${PLAYER_START_X}, "y": ${PLAYER_START_Y} }, "flagPole": { "x": ${FLAG_POLE_X} } },
  "safeZones": {
    "start": { "xRange": [0, ${SAFE_START_END_X}], "rules": ["flat ground", "no enemies", "no pipes", "no gaps"] },
    "finish": { "xRange": [${SAFE_FINISH_START_X}, ${LEVEL_TILES_WIDE - 1}], "rules": ["flat ground", "no gaps", "no enemies after x=${SAFE_FINISH_START_X - 1}"] }
  },
  "difficultyTargets": {
    "gaps": "${getGuideLabel(guide.gapCount)} gaps, max width ${guide.maxGapWidth} tiles",
    "pipes": "${getGuideLabel(guide.pipeCount)} pipes, each 2 tiles wide",
    "brickPlatforms": "${getGuideLabel(guide.brickCount)} rows at y=${guide.brickRows.min}-${guide.brickRows.max}",
    "questionBlocks": "${getGuideLabel(guide.questionCount)} blocks at y=${guide.questionRows.min}-${guide.questionRows.max}",
    "enemies": "${getGuideLabel(guide.enemyCount)} total enemies at y=${GROUND_ROW - 1}",
    "coins": "${getGuideLabel(guide.coinCount)} coins at y=${guide.coinRows.min}-${guide.coinRows.max}"
  }
}

PLACE THESE ELEMENTS (all x/y in tile units):

1. GROUND PLATFORMS (type "ground"): continuous segments at y=${GROUND_ROW} with ${getGuideLabel(guide.gapCount)} playable gaps. Cover most of the ${LEVEL_TILES_WIDE}-tile width. Never put a gap in the start or finish safe zones.

2. PIPES (type "pipe"): ${getGuideLabel(guide.pipeCount)} pipes, each 2 tiles wide, placed on the ground and spread across the middle of the level.

3. BRICK PLATFORMS (type "brick"): ${getGuideLabel(guide.brickCount)} floating brick rows at y=${guide.brickRows.min}-${guide.brickRows.max}, each 2-4 tiles wide.
   Each brick gets a "label" — a short ${cat.domain.split('—')[0].trim()} concept (1-2 words max).
   Examples: ${cat.techExamples}

4. QUESTION BLOCKS: ${getGuideLabel(guide.questionCount)} blocks at y=${guide.questionRows.min}-${guide.questionRows.max} (hittable from below).
   Each gets a "keyword" — a key concept the player "unlocks".
   Each gets a "reward": "coin", "mushroom", or "star" (mostly mushroom and coin, 1-2 stars max).
   Examples: ${cat.techExamples}

5. ENEMIES: ${getGuideLabel(guide.enemyCount)} enemies at y=${GROUND_ROW - 1} (on ground). Type "goomba" or "koopa".
   CRITICAL — distribute enemies in staged zones like a real Mario level:
${zoneGuide}
   Within each zone, space enemies at least 3 tiles apart except for intentional 2-enemy pairs.
   Never put more than 3 enemies within a 6-tile span.
   Keep the breather tiles between zones comparatively light.
   Each enemy gets a "keyword" — a bug/anti-pattern that the player "squashes" by stomping it.
   Make these realistic ${cat.domain.split('—')[0].trim()} bugs. Examples: ${cat.bugExamples}
   Every enemy MUST have a unique keyword.

6. COINS: ${getGuideLabel(guide.coinCount)} coins at y=${guide.coinRows.min}-${guide.coinRows.max}. Scatter them across the full route.

7. FLAG POLE: {"x": ${FLAG_POLE_X}}

Return ONLY valid JSON, no explanation. Exact format:
{
  "levelType": "${levelType}",
  "platforms": [
    {"x": 0, "y": 12, "width": 10, "type": "ground"},
    {"x": 20, "y": 7, "width": 3, "type": "brick", "label": "Rate Limit"}
  ],
  "questionBlocks": [
    {"x": 15, "y": 8, "keyword": "Circuit Breaker", "reward": "mushroom"}
  ],
  "enemies": [
    {"x": 12, "y": 11, "type": "goomba", "keyword": "N+1 Query"},
    {"x": 25, "y": 11, "type": "koopa", "keyword": "Deadlock"}
  ],
  "coins": [{"x": 12, "y": 6}],
  "flagPole": {"x": ${FLAG_POLE_X}}
}

SELF-CHECK BEFORE RESPONDING (do not output this checklist):
- levelType must be exactly "${levelType}"
- All coordinates in TILE units (not pixels)
- Ground at y=${GROUND_ROW}. Enemies at y=${GROUND_ROW - 1}. No enemies in gaps or on pipes.
- No impossible jumps (max gap = ${guide.maxGapWidth} tiles)
- Start zone x=0-${SAFE_START_END_X} must stay safe and flat.
- Finish zone x=${SAFE_FINISH_START_X}-${LEVEL_TILES_WIDE - 1} must stay safe and flat.
- Enemy totals and per-zone counts must match the difficulty blueprint above.
- Every enemy, brick, and question block must include its keyword/label field.
- Keywords should be real ${cat.domain.split('—')[0].trim()} terminology, not generic.
- If any rule fails, fix the layout before emitting the final JSON.`;
}
