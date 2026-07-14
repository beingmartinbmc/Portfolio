import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    let html = value;

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, rawUrl: string) => {
      const url = this.safeExternalUrl(rawUrl);
      return url
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="message-link">${label}</a>`
        : label;
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\n/g, '<br>');

    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }

  private safeExternalUrl(rawUrl: string): string | null {
    try {
      const url = new URL(rawUrl);
      return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.toString() : null;
    } catch {
      return null;
    }
  }
}
