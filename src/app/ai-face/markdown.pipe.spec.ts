import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownPipe } from './markdown.pipe';

describe('MarkdownPipe', () => {
  let pipe: MarkdownPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new MarkdownPipe(sanitizer);
  });

  function html(value: string): string {
    return pipe.transform(value) as string;
  }

  it('returns an empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
  });

  it('converts markdown links to anchor tags', () => {
    const result = html('See [my site](https://example.com)');
    expect(result).toContain('<a href="https://example.com"');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('my site</a>');
  });

  it('converts bold, italic, and inline code', () => {
    expect(html('**bold**')).toContain('<strong>bold</strong>');
    expect(html('*italic*')).toContain('<em>italic</em>');
    expect(html('`code`')).toContain('<code>code</code>');
  });

  it('converts newlines to <br>', () => {
    expect(html('line1\nline2')).toContain('<br>');
  });

  it('handles a mix of formatting', () => {
    const result = html('Hello **world**\nVisit [here](https://x.io) for `code`');
    expect(result).toContain('<strong>world</strong>');
    expect(result).toContain('<br>');
    expect(result).toContain('<code>code</code>');
    expect(result).toContain('<a href="https://x.io"');
  });
});
