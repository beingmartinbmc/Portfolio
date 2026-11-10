export type TokenKind = 'kw' | 'str' | 'num' | 'key' | 'punc' | 'cmt' | 'plain';

export interface Token {
  readonly text: string;
  readonly kind: TokenKind;
}

/** Order matters: the first alternative that matches at a position wins. */
const RULES: readonly (readonly [Exclude<TokenKind, 'plain'>, string])[] = [
  ['cmt', '//.*'],
  ['str', `'(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*"|\`(?:[^\`\\\\]|\\\\.)*\``],
  ['key', '[A-Za-z_$][\\w$]*(?=\\s*:)'],
  ['kw', '\\b(?:export|const|let|as|function|return|import|from|true|false|null|async|await|new)\\b'],
  ['num', '\\b\\d+(?:\\.\\d+)?\\b'],
  ['punc', '[{}\\[\\](),;:=<>.!?|&+\\-*/]+'],
];

const TOKEN = new RegExp(RULES.map(([kind, pattern]) => `(?<${kind}>${pattern})`).join('|'), 'g');

// ponytail: a line-at-a-time regex pass for the short snippets in code-world.data.ts. It does not handle
// multi-line strings or template literals; reach for a real highlighter if the snippets ever need them.
export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const at = match.index ?? 0;
    if (at > last) tokens.push({text: line.slice(last, at), kind: 'plain'});
    const kind = RULES.find(([name]) => match.groups?.[name] !== undefined)?.[0] ?? 'plain';
    tokens.push({text: match[0], kind});
    last = at + match[0].length;
  }
  if (last < line.length) tokens.push({text: line.slice(last), kind: 'plain'});
  return tokens;
}
