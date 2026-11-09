import {Component, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, HostListener, Output, ElementRef, AfterViewInit} from '@angular/core';
import {CODE_REALMS, CodeRealm} from './code-world.data';
import {Token, tokenize} from './code-world.highlight';
import {buildRain} from './code-world.rain';

@Component({
  selector: 'app-code-world',
  templateUrl: './code-world.component.html',
  styleUrls: ['./code-world.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeWorldComponent implements AfterViewInit {
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly visit = new EventEmitter<string>();

  readonly realms = CODE_REALMS;
  /** The whole route, drawn dim. */
  readonly path = CODE_REALMS.map(realm => `${realm.x},${realm.y}`).join(' ');
  /** The code behind everything is the portfolio's own, plus filler. */
  readonly rain = buildRain(CODE_REALMS.flatMap(realm => realm.code.split('\n')));
  /** Editor-style line numbers down the edge of the map. */
  readonly gutter = Array.from({length: 26}, (_, i) => i + 1);

  index = 0;
  /** The route walked so far, drawn bright. */
  travelled = this.pathTo(0);
  lines: Token[][] = this.highlight(0);
  /** The terminal's scrollback: the last few realms you ran. */
  history: {file: string; title: string; lines: number}[] = [];

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.log();
  }

  ngAfterViewInit(): void {
    this.host.nativeElement.querySelector<HTMLElement>('.world-panel')?.focus();
  }

  get realm(): CodeRealm {
    const realm = this.realms[this.index] ?? this.realms[0];
    if (!realm) throw new Error('code world has no realms');
    return realm;
  }

  select(index: number): void {
    this.index = (index + this.realms.length) % this.realms.length;
    this.travelled = this.pathTo(this.index);
    this.lines = this.highlight(this.index);
    this.log();
    this.cdr.markForCheck();
  }

  enter(): void {
    this.visit.emit(this.realm.id);
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  /** 'AI twin' -> 'aiTwin': a title as a function name. */
  fnName(title: string): string {
    const [first = '', ...rest] = title.split(/[^A-Za-z0-9]+/).filter(Boolean);
    return first.toLowerCase() + rest.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  }

  private log(): void {
    this.history = [...this.history, {file: this.realm.file, title: this.realm.title, lines: this.lines.length}].slice(-6);
  }

  private pathTo(index: number): string {
    return this.realms.slice(0, index + 1).map(realm => `${realm.x},${realm.y}`).join(' ');
  }

  /** Each realm reads as a whole file: a header, the snippet, and the line that registers it. */
  private highlight(index: number): Token[][] {
    const realm = this.realms[index];
    if (!realm) return [];
    const name = /export const (\w+)/.exec(realm.code)?.[1] ?? 'realm';
    return [
      `// ${realm.file}`,
      `import { portfolio } from './world';`,
      '',
      ...realm.code.split('\n'),
      '',
      `portfolio.register('${realm.id}', ${name});`,
    ].map(tokenize);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closed.emit();
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.select(this.index + 1);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.select(this.index - 1);
      return;
    }
    if (event.key === 'Enter' && !(event.target instanceof Element && event.target.closest('.world-close'))) {
      event.preventDefault();
      this.enter();
    }
  }
}
