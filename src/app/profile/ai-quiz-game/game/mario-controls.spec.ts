import { MarioControls } from './mario-controls';

function press(code: string): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { code }));
}
function release(code: string): void {
  window.dispatchEvent(new KeyboardEvent('keyup', { code }));
}

describe('MarioControls', () => {
  let controls: MarioControls;

  beforeEach(() => {
    controls = new MarioControls();
    controls.bind();
  });

  afterEach(() => {
    controls.unbind();
  });

  it('starts with no keys pressed', () => {
    expect(controls.getState()).toEqual({ left: false, right: false, jump: false, fire: false, run: false, down: false });
  });

  it('returns a copy of state (not a live reference)', () => {
    const a = controls.getState();
    a.left = true;
    expect(controls.getState().left).toBeFalse();
  });

  describe('keyboard mapping', () => {
    const cases: { codes: string[]; key: 'left' | 'right' | 'jump' | 'fire' | 'down' }[] = [
      { codes: ['ArrowLeft', 'KeyA'], key: 'left' },
      { codes: ['ArrowRight', 'KeyD'], key: 'right' },
      { codes: ['ArrowUp', 'KeyW', 'Space'], key: 'jump' },
      { codes: ['KeyX', 'KeyZ', 'ShiftLeft', 'ShiftRight'], key: 'fire' },
      { codes: ['ArrowDown', 'KeyS'], key: 'down' },
    ];

    cases.forEach(({ codes, key }) => {
      codes.forEach((code) => {
        it(`maps ${code} to ${key} on down and clears it on up`, () => {
          press(code);
          expect(controls.getState()[key]).toBeTrue();
          release(code);
          expect(controls.getState()[key]).toBeFalse();
        });
      });
    });

    it('ignores unmapped keys', () => {
      press('KeyQ');
      expect(controls.getState()).toEqual({ left: false, right: false, jump: false, fire: false, run: false, down: false });
    });
  });

  describe('touch controls', () => {
    it('sets each direction independently', () => {
      controls.setTouchLeft(true);
      controls.setTouchRight(true);
      controls.setTouchJump(true);
      controls.setTouchFire(true);
      expect(controls.getState()).toEqual({ left: true, right: true, jump: true, fire: true, run: true, down: false });
    });
  });

  describe('reset & unbind', () => {
    it('reset clears all state', () => {
      controls.setTouchLeft(true);
      controls.reset();
      expect(controls.getState().left).toBeFalse();
    });

    it('unbind stops responding to key events', () => {
      controls.unbind();
      press('ArrowRight');
      expect(controls.getState().right).toBeFalse();
    });
  });
});
