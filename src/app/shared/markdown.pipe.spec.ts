import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownPipe } from './markdown.pipe';

describe('MarkdownPipe', () => {
  let pipe: MarkdownPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = new MarkdownPipe(TestBed.inject(DomSanitizer));
  });

  function html(value: string): string {
    return pipe.transform(value) as string;
  }

  it('returns an empty string for empty input', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as any)).toBe('');
  });

  it('converts safe markdown links to external anchors', () => {
    const result = html('See [my site](https://example.com)');
    expect(result).toContain('<a href="https://example.com/"');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain('my site</a>');
  });

  it('does not create anchors for unsafe URL schemes', () => {
    const result = html('[unsafe](javascript:alert(1))');
    expect(result).not.toContain('<a');
    expect(result).not.toContain('javascript:');
    expect(result).toContain('unsafe');
  });

  it('keeps angle brackets and ampersands as literal text', () => {
    const out = String(pipe.transform('Use `List<String>` & Map<K, V>'));
    expect(out).toContain('<code>List&lt;String&gt;</code>');
    expect(out).toContain('&amp; Map&lt;K, V&gt;');
  });

  it('keeps query strings intact in link URLs', () => {
    const out = String(pipe.transform('[docs](https://example.com/?a=1&b=2)'));
    expect(out).toContain('href="https://example.com/?a=1&amp;b=2"');
  });

  it('converts bold, italic, inline code, and newlines', () => {
    const result = html('**bold** *italic* `code`\nnext');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
    expect(result).toContain('<code>code</code>');
    expect(result).toContain('<br>');
  });
});
