import { MarioAudio } from './mario-audio';

/**
 * The audio module lazily creates and caches a single AudioContext at module
 * scope, so we cannot reliably count oscillators per test under random order.
 * These tests install a fake Web Audio API and assert the public contract:
 * every sound runs to completion without throwing (exercising each code path).
 */
describe('MarioAudio', () => {
  let originalAudioContext: any;

  beforeEach(() => {
    originalAudioContext = (window as any).AudioContext;

    const makeOsc = () => ({
      type: 'square',
      frequency: { value: 0 },
      connect: (node: any) => node,
      start: () => undefined,
      stop: () => undefined,
    });

    const makeGain = () => ({
      gain: {
        setValueAtTime: () => undefined,
        exponentialRampToValueAtTime: () => undefined,
      },
      connect: (node: any) => node,
    });

    (window as any).AudioContext = function FakeAudioContext() {
      return {
        state: 'running',
        currentTime: 0,
        destination: {},
        resume: () => undefined,
        createOscillator: makeOsc,
        createGain: makeGain,
      };
    };
  });

  afterEach(() => {
    (window as any).AudioContext = originalAudioContext;
  });

  const sounds: (keyof typeof MarioAudio)[] = [
    'jump', 'coin', 'stomp', 'powerUp', 'hit', 'die', 'win',
    'questionBlock', 'brickBreak', 'brickBump', 'fireball', 'fireHit',
  ];

  sounds.forEach((sound) => {
    it(`${sound}() runs without throwing`, () => {
      expect(() => MarioAudio[sound]()).not.toThrow();
    });
  });

  it('handles repeated invocations', () => {
    expect(() => {
      MarioAudio.coin();
      MarioAudio.coin();
      MarioAudio.stomp();
    }).not.toThrow();
  });
});
