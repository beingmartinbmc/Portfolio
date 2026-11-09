import {tokenize} from './code-world.highlight';
import {CODE_REALMS} from './code-world.data';

const kinds = (line: string): string[] => tokenize(line).map(token => `${token.kind}:${token.text}`);

describe('tokenize', () => {
  it('colours keywords, keys, strings and punctuation', () => {
    expect(kinds(`export const a = {`)).toEqual([
      'kw:export', 'plain: ', 'kw:const', 'plain: a ', 'punc:=', 'plain: ', 'punc:{',
    ]);
    expect(kinds(`  role: 'Senior Backend Engineer',`)).toEqual([
      'plain:  ', 'key:role', 'punc::', 'plain: ', `str:'Senior Backend Engineer'`, 'punc:,',
    ]);
  });

  it('handles numbers and trailing comments, and keeps `//` inside a string a string', () => {
    expect(kinds(`years: 6; // since 2020`).map(k => k.split(':')[0])).toEqual(['key', 'punc', 'plain', 'num', 'punc', 'plain', 'cmt']);
    expect(tokenize(`url: 'a//b'`).find(token => token.kind === 'str')?.text).toBe(`'a//b'`);
  });

  it('is lossless: joining the tokens gives the line back, for every realm snippet', () => {
    for (const realm of CODE_REALMS) {
      for (const line of realm.code.split('\n')) {
        expect(tokenize(line).map(token => token.text).join('')).toBe(line);
      }
    }
  });
});
