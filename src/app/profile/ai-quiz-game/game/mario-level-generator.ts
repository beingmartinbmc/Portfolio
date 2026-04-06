import { TILE, Platform, Enemy, Coin, QuestionBlock, FlagPole, Level, Player, PowerUpType, FloatingText, Debris, CATEGORY_KEYWORDS, CATEGORY_BUG_KEYWORDS } from './mario-entities';

const LEVEL_TILES_WIDE = 80;
const GROUND_ROW = 12;
const LEVEL_ROWS = 14;

export interface LevelConfig {
  difficulty: string;
  category?: string;
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

interface RawLevelData {
  platforms?: { x: number; y: number; width: number; type?: string; label?: string }[];
  questionBlocks?: { x: number; y: number; keyword?: string; reward?: string }[];
  enemies?: { x: number; y: number; type?: string; keyword?: string }[];
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
  const category = config.category || 'backend';
  const fallbackKw = shuffleKeywords(CATEGORY_KEYWORDS[category] ?? CATEGORY_KEYWORDS['backend']);
  const fallbackBug = shuffleKeywords(CATEGORY_BUG_KEYWORDS[category] ?? CATEGORY_BUG_KEYWORDS['backend']);
  let kwIdx = 0;
  let bugIdx = 0;

  const levelW = LEVEL_TILES_WIDE * TILE;
  const levelH = LEVEL_ROWS * TILE;

  if (data.platforms) {
    for (const p of data.platforms) {
      const type = (p.type === 'brick' || p.type === 'pipe' || p.type === 'ground') ? p.type : 'ground';
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

  const flagX = data.flagPole?.x ? data.flagPole.x * TILE : (LEVEL_TILES_WIDE - 4) * TILE;
  const flagPole = new FlagPole(flagX, 3 * TILE, (GROUND_ROW - 3) * TILE);

  return { platforms, enemies, coins, questionBlocks, fireballs: [], flagPole, floatingTexts: [], debris: [], width: levelW, height: levelH, category };
}

export function generateProceduralLevel(config: LevelConfig): Level {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const coins: Coin[] = [];
  const questionBlocks: QuestionBlock[] = [];
  const category = config.category || 'backend';
  const keywords = shuffleKeywords(CATEGORY_KEYWORDS[category] ?? CATEGORY_KEYWORDS['backend']);
  const bugKw = shuffleKeywords(CATEGORY_BUG_KEYWORDS[category] ?? CATEGORY_BUG_KEYWORDS['backend']);
  let kwIdx = 0;
  let bugIdx = 0;

  const levelW = LEVEL_TILES_WIDE * TILE;
  const levelH = LEVEL_ROWS * TILE;
  const gY = GROUND_ROW * TILE;

  // Ground with gaps
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

  // Pipes
  const pipeCount = config.difficulty === 'Hard' ? 3 : 2;
  const pipePositions: number[] = [];
  const pipeSpacing = Math.floor((LEVEL_TILES_WIDE - 24) / (pipeCount + 1));
  for (let i = 0; i < pipeCount; i++) {
    const px = 12 + pipeSpacing * (i + 1);
    const ph = 2 * TILE;
    platforms.push(new Platform(px * TILE, gY - ph, TILE * 2, ph, 'pipe'));
    pipePositions.push(px);
  }

  const isNearPipe = (tx: number): boolean =>
    pipePositions.some(px => tx >= px - 2 && tx <= px + 3);

  // Floating brick platforms with category labels
  const brickCount = config.difficulty === 'Hard' ? 8 : config.difficulty === 'Medium' ? 6 : 4;
  for (let i = 0; i < brickCount; i++) {
    let bx: number;
    let attempts = 0;
    do { bx = 8 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 16)); attempts++; }
    while (isNearPipe(bx) && attempts < 20);
    const by = 7 + Math.floor(Math.random() * 3);
    const bw = 2 + Math.floor(Math.random() * 3);
    const brick = new Platform(bx * TILE, by * TILE, bw * TILE, TILE, 'brick');
    brick.label = keywords[kwIdx % keywords.length];
    kwIdx++;
    platforms.push(brick);
  }

  // Question blocks with category keywords
  const qCount = config.difficulty === 'Hard' ? 5 : config.difficulty === 'Medium' ? 7 : 9;
  const spacing = Math.floor((LEVEL_TILES_WIDE - 12) / (qCount + 1));
  const rewards = assignRewards(qCount);
  for (let i = 0; i < qCount; i++) {
    let qx = 6 + spacing * (i + 1) + Math.floor(Math.random() * 3 - 1);
    if (isNearPipe(qx)) qx += 4;
    const qy = 8 + Math.floor(Math.random() * 2);
    const qb = new QuestionBlock(qx * TILE, qy * TILE, rewards[i]);
    qb.keyword = keywords[kwIdx % keywords.length];
    kwIdx++;
    questionBlocks.push(qb);
  }

  // Enemies with bug keywords
  const enemyCount = config.difficulty === 'Hard' ? 20 : config.difficulty === 'Medium' ? 14 : 9;
  for (let i = 0; i < enemyCount; i++) {
    let ex: number;
    let attempts = 0;
    do { ex = 10 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 20)); attempts++; }
    while (isNearPipe(ex) && attempts < 20);
    const ey = GROUND_ROW - 1;
    const type = Math.random() < 0.3 ? 'koopa' : 'goomba';
    const enemy = new Enemy(ex * TILE, ey * TILE, type as any);
    enemy.keyword = bugKw[bugIdx % bugKw.length];
    bugIdx++;
    enemies.push(enemy);
  }

  // Coins
  const coinCount = config.difficulty === 'Hard' ? 30 : config.difficulty === 'Medium' ? 25 : 18;
  for (let i = 0; i < coinCount; i++) {
    let cx: number;
    let attempts = 0;
    do { cx = 5 + Math.floor(Math.random() * (LEVEL_TILES_WIDE - 10)); attempts++; }
    while (isNearPipe(cx) && attempts < 15);
    const cy = 5 + Math.floor(Math.random() * 6);
    coins.push(new Coin(cx * TILE + TILE * 0.25, cy * TILE + TILE * 0.25));
  }

  const flagPole = new FlagPole((LEVEL_TILES_WIDE - 4) * TILE, 3 * TILE, (GROUND_ROW - 3) * TILE);

  return { platforms, enemies, coins, questionBlocks, fireballs: [], flagPole, floatingTexts: [], debris: [], width: levelW, height: levelH, category };
}

export function createPlayer(): Player {
  return new Player(3 * TILE, (GROUND_ROW - 1) * TILE - TILE);
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

export function getLevelGenerationPrompt(category: string, difficulty: string): string {
  const cat = CATEGORY_DESCRIPTIONS[category] ?? CATEGORY_DESCRIPTIONS['backend'];
  const enemyCount = difficulty === 'Hard' ? '18-22' : difficulty === 'Medium' ? '12-15' : '8-10';
  const qCount = difficulty === 'Hard' ? '4-6' : difficulty === 'Medium' ? '6-8' : '8-10';
  const gapGuide = difficulty === 'Hard' ? '3-4 gaps (2-3 tiles wide)' : difficulty === 'Medium' ? '2-3 gaps (2 tiles wide)' : '1-2 small gaps';
  const brickGuide = difficulty === 'Hard' ? '6-8' : difficulty === 'Medium' ? '4-6' : '3-5';
  const pipeGuide = difficulty === 'Hard' ? '3-4' : difficulty === 'Medium' ? '2-3' : '1-2';

  return `You are a game level designer building a Mario-style platformer level for a "${cat.domain}" themed world at "${difficulty}" difficulty.

GRID: 80 tiles wide × 14 tiles tall. Row 0 = top, row 12 = ground surface. Player starts at (3, 11). Flag pole at x=76.

PLACE THESE ELEMENTS (all x/y in tile units):

1. GROUND PLATFORMS (type "ground"): continuous segments at y=12 with ${gapGuide}. Cover most of the 80-tile width.

2. PIPES (type "pipe"): ${pipeGuide} pipes, each 2 tiles wide, placed on the ground. Spread them evenly.

3. BRICK PLATFORMS (type "brick"): ${brickGuide} floating brick rows at y=6-9, each 2-4 tiles wide.
   Each brick gets a "label" — a short ${cat.domain.split('—')[0].trim()} concept (1-2 words max).
   Examples: ${cat.techExamples}

4. QUESTION BLOCKS: ${qCount} blocks at y=7-9 (hittable from below).
   Each gets a "keyword" — a key concept the player "unlocks".
   Each gets a "reward": "coin", "mushroom", or "star" (mostly mushroom and coin, 1-2 stars max).
   Examples: ${cat.techExamples}

5. ENEMIES: ${enemyCount} enemies at y=11 (on ground). Type "goomba" (70%) or "koopa" (30%).
   IMPORTANT: spread them across the FULL level (x=8 to x=72). Don't cluster them.
   Each enemy gets a "keyword" — a bug/anti-pattern that the player "squashes" by stomping it.
   Make these realistic ${cat.domain.split('—')[0].trim()} bugs. Examples: ${cat.bugExamples}
   Every enemy MUST have a unique keyword.

6. COINS: 20-35 coins at y=4-10. Scatter across the level.

7. FLAG POLE: {"x": 76}

Return ONLY valid JSON, no explanation. Exact format:
{
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
  "flagPole": {"x": 76}
}

RULES:
- All coordinates in TILE units (not pixels)
- Ground at y=12. Enemies at y=11. No enemies in gaps or on pipes.
- No impossible jumps (max gap = 3 tiles)
- Enemies MUST be spread across x=8 to x=72, not clustered
- Every enemy, brick, and question block MUST have its keyword/label field
- Keywords should be real ${cat.domain.split('—')[0].trim()} terminology, not generic`;
}
