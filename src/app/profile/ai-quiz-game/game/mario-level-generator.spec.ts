import {
  parseLevelFromAI,
  validateAILevelData,
  buildLevelFromData,
  generateProceduralLevel,
  createPlayer,
  getLevelGenerationPrompt,
  LevelConfig,
} from './mario-level-generator';
import { TILE } from './mario-entities';

const FLAG_POLE_X = 92; // LEVEL_TILES_WIDE - 4

describe('mario-level-generator', () => {
  describe('parseLevelFromAI', () => {
    it('extracts a JSON object embedded in prose', () => {
      const raw = 'Here you go:\n{"platforms":[{"x":0,"y":12,"width":10}]}\nEnjoy!';
      const data = parseLevelFromAI(raw);
      expect(data).not.toBeNull();
      expect(data!.platforms!.length).toBe(1);
    });

    it('returns null when there is no JSON', () => {
      expect(parseLevelFromAI('no json here')).toBeNull();
    });

    it('returns null when JSON lacks a platforms array', () => {
      expect(parseLevelFromAI('{"foo":1}')).toBeNull();
    });

    it('returns null on malformed JSON', () => {
      expect(parseLevelFromAI('{ this is : broken }')).toBeNull();
    });
  });

  describe('createPlayer', () => {
    it('creates a player at the start position', () => {
      const p = createPlayer();
      expect(p.x).toBe(3 * TILE);
      expect(p.lives).toBe(3);
    });
  });

  describe('generateProceduralLevel', () => {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const levelTypes: LevelConfig['levelType'][] = ['ground', 'sky', 'water'];

    difficulties.forEach((difficulty) => {
      levelTypes.forEach((levelType) => {
        it(`produces a populated ${difficulty}/${levelType} level`, () => {
          const level = generateProceduralLevel({ difficulty, category: 'backend', levelType });
          expect(level.platforms.length).toBeGreaterThan(0);
          expect(level.enemies.length).toBeGreaterThan(0);
          expect(level.coins.length).toBeGreaterThan(0);
          expect(level.questionBlocks.length).toBeGreaterThan(0);
          expect(level.flagPole).toBeTruthy();
          expect(level.levelType).toBe(levelType!);
          // every enemy and question block must carry a keyword
          expect(level.enemies.every((e) => !!e.keyword)).toBeTrue();
          expect(level.questionBlocks.every((q) => !!q.keyword)).toBeTrue();
        });
      });
    });

    it('falls back to the backend keyword pool for unknown categories', () => {
      const level = generateProceduralLevel({ difficulty: 'Easy', category: 'nonsense' });
      expect(level.category).toBe('nonsense');
      expect(level.enemies.every((e) => !!e.keyword)).toBeTrue();
    });

    it('defaults difficulty handling to the easy blueprint for unknown difficulty', () => {
      const level = generateProceduralLevel({ difficulty: 'Whatever', category: 'backend' });
      expect(level.platforms.length).toBeGreaterThan(0);
    });
  });

  describe('buildLevelFromData', () => {
    const config: LevelConfig = { difficulty: 'Easy', category: 'backend', levelType: 'ground' };

    it('converts raw tile data into pixel-space entities', () => {
      const data = {
        levelType: 'ground',
        platforms: [
          { x: 0, y: 12, width: 10, type: 'ground' },
          { x: 20, y: 7, width: 3, type: 'brick', label: 'Cache' },
          { x: 30, y: 10, width: 2, type: 'pipe' },
        ],
        questionBlocks: [{ x: 15, y: 8, keyword: 'Retry', reward: 'mushroom' }],
        enemies: [{ x: 12, y: 11, type: 'koopa', keyword: 'Deadlock' }],
        coins: [{ x: 12, y: 6 }],
        flagPole: { x: FLAG_POLE_X },
      };
      const level = buildLevelFromData(data, config);
      expect(level.platforms.length).toBe(3);
      expect(level.platforms[0]!.x).toBe(0);
      expect(level.platforms[1]!.label).toBe('Cache');
      expect(level.questionBlocks[0]!.reward).toBe('mushroom');
      expect(level.questionBlocks[0]!.keyword).toBe('Retry');
      expect(level.enemies[0]!.type).toBe('koopa');
      expect(level.coins[0]!.x).toBe(12 * TILE);
      expect(level.flagPole.x).toBe(FLAG_POLE_X * TILE);
    });

    it('supplies fallback labels/keywords when missing', () => {
      const data = {
        platforms: [{ x: 20, y: 7, width: 3, type: 'brick' }],
        questionBlocks: [{ x: 15, y: 8 }],
        enemies: [{ x: 12, y: 11 }],
      };
      const level = buildLevelFromData(data, config);
      expect(level.platforms[0]!.label).toBeTruthy();
      expect(level.questionBlocks[0]!.keyword).toBeTruthy();
      expect(level.enemies[0]!.keyword).toBeTruthy();
      expect(level.enemies[0]!.type).toBe('goomba'); // default
    });

    it('uses the default flag position when none is provided', () => {
      const level = buildLevelFromData({ platforms: [] }, config);
      expect(level.flagPole.x).toBe(FLAG_POLE_X * TILE);
    });
  });

  describe('validateAILevelData', () => {
    function validLevel() {
      // Build a level that satisfies the Easy blueprint by generating one,
      // then expressing it back in tile units.
      return generateToRaw('Easy', 'backend');
    }

    it('accepts a procedurally generated layout (round-trip)', () => {
      const { raw, config } = validLevel();
      const result = validateAILevelData(raw, config);
      // Procedural generation should satisfy its own blueprint.
      expect(result.valid).withContext(result.issues.join('\n')).toBeTrue();
    });

    it('flags out-of-bounds platforms', () => {
      const result = validateAILevelData(
        { platforms: [{ x: -5, y: 99, width: 10, type: 'ground' }] },
        { difficulty: 'Easy' },
      );
      expect(result.valid).toBeFalse();
      expect(result.issues.some((i) => i.includes('out of bounds'))).toBeTrue();
    });

    it('flags a level-type mismatch', () => {
      const result = validateAILevelData(
        { levelType: 'sky', platforms: [] },
        { difficulty: 'Easy', levelType: 'ground' },
      );
      expect(result.issues.some((i) => i.includes('levelType'))).toBeTrue();
    });

    it('flags bricks missing labels', () => {
      const result = validateAILevelData(
        { platforms: [{ x: 20, y: 7, width: 3, type: 'brick' }] },
        { difficulty: 'Easy' },
      );
      expect(result.issues.some((i) => i.includes('missing a label'))).toBeTrue();
    });

    it('flags non-finite platform coordinates', () => {
      const result = validateAILevelData(
        { platforms: [{ x: NaN, y: 12, width: 10, type: 'ground' }] },
        { difficulty: 'Easy' },
      );
      expect(result.issues.some((i) => i.includes('finite'))).toBeTrue();
    });

    it('flags a misplaced flag pole', () => {
      const result = validateAILevelData(
        { platforms: [], flagPole: { x: 5 } },
        { difficulty: 'Easy' },
      );
      expect(result.issues.some((i) => i.includes('Flag pole'))).toBeTrue();
    });
  });

  describe('getLevelGenerationPrompt', () => {
    it('includes the requested category and level type guidance', () => {
      const prompt = getLevelGenerationPrompt('genai', 'Hard', 'water');
      expect(prompt).toContain('JSON');
      expect(prompt.toLowerCase()).toContain('water');
      expect(prompt.length).toBeGreaterThan(100);
    });

    it('handles an unknown category gracefully', () => {
      const prompt = getLevelGenerationPrompt('unknown-cat', 'Easy', 'ground');
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(100);
    });
  });
});

/**
 * Generate a procedural level, then express it back in raw tile-unit form so the
 * validator can be exercised against a layout that satisfies its own blueprint.
 */
function generateToRaw(difficulty: string, category: string): { raw: any; config: LevelConfig } {
  const config: LevelConfig = { difficulty, category, levelType: 'ground' };
  const level = generateProceduralLevel(config);
  const raw = {
    levelType: level.levelType,
    platforms: level.platforms.map((p) => ({
      x: Math.round(p.x / TILE),
      y: Math.round(p.y / TILE),
      width: Math.round(p.w / TILE),
      type: p.type,
      label: p.label || undefined,
    })),
    questionBlocks: level.questionBlocks.map((q) => ({
      x: Math.round(q.x / TILE),
      y: Math.round(q.y / TILE),
      keyword: q.keyword,
      reward: q.reward,
    })),
    enemies: level.enemies.map((e) => ({
      x: Math.round(e.x / TILE),
      y: Math.round(e.y / TILE),
      type: e.type,
      keyword: e.keyword,
    })),
    coins: level.coins.map((c) => ({
      x: Math.round(c.x / TILE),
      y: Math.round(c.y / TILE),
    })),
    flagPole: { x: FLAG_POLE_X },
  };
  return { raw, config };
}
