export interface RainColumn {
  /** Two identical copies of the block, so a -50% drift loops without a seam. */
  readonly text: string;
  readonly duration: number;
  readonly delay: number;
  readonly up: boolean;
}

/** Generic lines mixed in with the portfolio's own snippets. */
const FILLER: readonly string[] = [
  '0xC0DE',
  'while (alive) { ship(); }',
  'await Promise.all(tasks);',
  '// TODO: sleep',
  'if (!ok) rollback();',
  'kafka.send(topic, event);',
  'return p99 < 200;',
  'npm run build && npm test',
  'SELECT * FROM impact;',
  'try { run(); } catch { retry(); }',
  'git push --force-with-lease',
  '$ kubectl rollout status',
  'const ok = () => true;',
  'fn main() {}',
  '/* it works on my machine */',
];

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

/**
 * Deterministic, so the backdrop is identical on every open and in tests.
 * A column's loop block must be taller than the screen (120 lines is ~2.3k px, enough for a 4K-tall screen), or the drift leaves a gap.
 */
export function buildRain(source: readonly string[], columns = 12, linesPerColumn = 120): RainColumn[] {
  const pool = [...source.map(line => line.trimEnd()).filter(Boolean), ...FILLER];
  const random = seeded(0x5eed);
  return Array.from({length: columns}, (_, i) => {
    const block = Array.from({length: linesPerColumn}, () => pool[Math.floor(random() * pool.length)] ?? '').join('\n');
    const duration = 42 + random() * 40;
    return {
      text: `${block}\n${block}`,
      duration: Math.round(duration),
      delay: -Math.round(random() * duration),
      up: i % 3 === 1,
    };
  });
}
