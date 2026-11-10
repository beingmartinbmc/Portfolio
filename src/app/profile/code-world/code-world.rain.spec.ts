import {buildRain} from './code-world.rain';

describe('buildRain', () => {
  const source = ['export const a = 1;', 'return b;', ''];

  it('is deterministic', () => {
    expect(buildRain(source)).toEqual(buildRain(source));
  });

  it('loops without a seam: the text is two identical halves', () => {
    for (const column of buildRain(source, 4, 10)) {
      const lines = column.text.split('\n');
      expect(lines.length).toBe(20);
      expect(lines.slice(0, 10)).toEqual(lines.slice(10));
    }
  });

  it('uses the portfolio source and never emits blank lines or a negative duration', () => {
    const columns = buildRain(source, 6, 50);
    expect(columns.some(column => column.text.includes('export const a = 1;'))).toBeTrue();
    expect(columns.every(column => column.text.split('\n').every(Boolean))).toBeTrue();
    expect(columns.every(column => column.duration > 0 && column.delay <= 0)).toBeTrue();
  });

  it('is tall enough to cover a screen: a column block is at least ~1500px of 0.72rem/1.7 lines', () => {
    const [column] = buildRain(source);
    const blockLines = (column?.text.split('\n').length ?? 0) / 2;
    expect(blockLines * 0.72 * 16 * 1.7).toBeGreaterThan(1500);
  });
});
