import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CodeWorldComponent} from './code-world.component';
import {CODE_REALMS} from './code-world.data';

describe('CodeWorldComponent', () => {
  let fixture: ComponentFixture<CodeWorldComponent>;
  let component: CodeWorldComponent;
  const el = (): HTMLElement => fixture.nativeElement;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [CodeWorldComponent]});
    fixture = TestBed.createComponent(CodeWorldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('covers every realm and opens the one selected', () => {
    expect(el().querySelectorAll('.realm-node').length).toBe(CODE_REALMS.length);

    const visited: string[] = [];
    component.visit.subscribe(id => visited.push(id));
    const realm = CODE_REALMS[4];
    if (!realm) throw new Error('missing realm');
    el().querySelectorAll<HTMLElement>('.realm-node')[4]!.click();
    fixture.detectChanges();

    expect(el().querySelector('.source-tab')!.textContent).toContain(realm.file);
    component.enter();
    expect(visited).toEqual([realm.id]);
  });

  it('fills the screen with code: drifting columns behind the window, hidden from assistive tech', () => {
    const rain = el().querySelector('.code-rain');
    expect(rain?.getAttribute('aria-hidden')).toBe('true');
    expect(rain?.querySelectorAll('.rain-col').length).toBeGreaterThanOrEqual(8);
    expect(rain?.textContent).toContain('export const ankit'); // the portfolio's own snippet, not lorem ipsum
  });

  it('shows the selected realm as a whole highlighted, numbered file', () => {
    const lines = el().querySelectorAll('.source-line');
    expect(lines.length).toBe(CODE_REALMS[0]!.code.split('\n').length + 5); // comment, import, blank, ...snippet, blank, register
    expect(lines[0]!.querySelector('.line-no')?.textContent).toBe('1');
    expect(lines[0]!.querySelector('.tok-cmt')?.textContent).toBe('// main.ts');
    expect(lines[1]!.querySelector('.tok-kw')?.textContent).toBe('import');
    expect(lines[3]!.querySelector('.tok-kw')?.textContent).toBe('export');
    expect(lines[lines.length - 1]!.textContent).toContain(`portfolio.register('top', ankit);`);
    expect(el().querySelector('.source-code')!.textContent).toContain('Senior Backend Engineer');
  });

  it('names chips as functions and keeps the terminal as a short scrollback of what you ran', () => {
    expect(component.fnName('AI twin')).toBe('aiTwin');
    expect(component.fnName('Open source')).toBe('openSource');
    expect(component.fnName('Origin')).toBe('origin');

    component.select(1);
    component.select(2);
    fixture.detectChanges();
    const terminal = el().querySelector('.terminal')!.textContent!;
    expect(terminal).toContain('ts-node about.ts');
    expect(terminal).toContain('ts-node experience.ts');

    for (let i = 0; i < 20; i++) component.select(i);
    expect(component.history.length).toBe(6);
  });

  it('swaps the source and restarts its typing animation on every realm change', () => {
    const code = (): HTMLElement => el().querySelector<HTMLElement>('.source-code')!;
    expect(code().classList.contains('flip')).toBeFalse();

    component.select(1);
    fixture.detectChanges();
    expect(code().textContent).toContain('years');
    expect(code().classList.contains('flip')).toBeTrue(); // new animation name => the browser restarts it

    component.select(2);
    fixture.detectChanges();
    expect(code().classList.contains('flip')).toBeFalse();
  });

  it('walks the route: the bright path grows with the selection and wraps around', () => {
    const points = (): number => component.travelled.split(' ').length;
    expect(points()).toBe(1);
    component.select(3);
    expect(points()).toBe(4);
    component.select(-1);
    expect(component.index).toBe(CODE_REALMS.length - 1);
    expect(points()).toBe(CODE_REALMS.length);
  });

  it('moves with the arrow keys, opens with Enter, closes with Escape', () => {
    const visited: string[] = [];
    let closed = 0;
    component.visit.subscribe(id => visited.push(id));
    component.closed.subscribe(() => closed++);

    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight'}));
    expect(component.index).toBe(1);
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft'}));
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
    expect(component.index).toBe(CODE_REALMS.length - 1);

    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
    expect(visited).toEqual([CODE_REALMS[CODE_REALMS.length - 1]!.id]);
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(closed).toBe(1);
  });
});
