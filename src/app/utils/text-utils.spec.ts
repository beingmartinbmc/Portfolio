import { cleanTextForSpeech } from './text-utils';

describe('cleanTextForSpeech', () => {
  describe('guard clauses', () => {
    it('returns an empty string for null/undefined/empty input', () => {
      expect(cleanTextForSpeech(null as unknown as string)).toBe('');
      expect(cleanTextForSpeech(undefined as unknown as string)).toBe('');
      expect(cleanTextForSpeech('')).toBe('');
    });

    it('returns an empty string for non-string input', () => {
      expect(cleanTextForSpeech(42 as unknown as string)).toBe('');
      expect(cleanTextForSpeech({} as unknown as string)).toBe('');
      expect(cleanTextForSpeech([] as unknown as string)).toBe('');
    });
  });

  describe('markdown stripping', () => {
    it('strips bold-italic, bold and italic markers but keeps the words', () => {
      expect(cleanTextForSpeech('***wow***')).toBe('wow');
      expect(cleanTextForSpeech('**bold**')).toBe('bold');
      expect(cleanTextForSpeech('*italic*')).toBe('italic');
      expect(cleanTextForSpeech('__bold__')).toBe('bold');
      expect(cleanTextForSpeech('_italic_')).toBe('italic');
    });

    it('strips inline code markers', () => {
      expect(cleanTextForSpeech('use `npm ci` now')).toBe('use npm ci now');
    });

    it('strips heading markers of every level', () => {
      expect(cleanTextForSpeech('# H1')).toBe('H1');
      expect(cleanTextForSpeech('###### H6')).toBe('H6');
    });

    it('keeps link text but drops the URL', () => {
      expect(cleanTextForSpeech('see [my profile](https://example.com)')).toBe('see my profile');
    });

    it('drops the image source while keeping the alt text', () => {
      expect(cleanTextForSpeech('![avatar](https://example.com/a.png)')).toContain('avatar');
    });

    it('removes leftover markdown punctuation characters', () => {
      expect(cleanTextForSpeech('a ~ b [ c ] ( d )')).toBe('a b c d');
    });
  });

  describe('emoji and whitespace handling', () => {
    it('removes the documented set of emojis', () => {
      expect(cleanTextForSpeech('Hi 👋 there 🤖')).toBe('Hi there');
    });

    it('collapses repeated whitespace and trims the result', () => {
      expect(cleanTextForSpeech('  too    many\n\nspaces  ')).toBe('too many spaces');
    });
  });

  describe('integration', () => {
    it('cleans a realistic mixed-markdown assistant reply', () => {
      const input = '## Summary\n\nCheck out **[node-actuator-lite](https://npmjs.com/x)** — it is `lightweight`! 🤖';
      expect(cleanTextForSpeech(input)).toBe('Summary Check out node-actuator-lite — it is lightweight!');
    });

    it('is idempotent on already-clean text', () => {
      const clean = 'This is a plain sentence.';
      expect(cleanTextForSpeech(clean)).toBe(clean);
      expect(cleanTextForSpeech(cleanTextForSpeech(clean))).toBe(clean);
    });
  });
});
