let audioCtx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', vol = 0.12): void {
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch { /* audio not available */ }
}

function playSequence(notes: [number, number][], type: OscillatorType = 'square', vol = 0.10): void {
  try {
    const ac = ctx();
    let t = ac.currentTime;
    for (const [freq, dur] of notes) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur * 0.85;
    }
  } catch { /* audio not available */ }
}

export const MarioAudio = {
  jump(): void {
    playSequence([[260, 0.06], [340, 0.06], [420, 0.08]], 'square', 0.08);
  },

  coin(): void {
    playSequence([[988, 0.06], [1319, 0.12]], 'square', 0.08);
  },

  stomp(): void {
    playTone(180, 0.08, 'square', 0.10);
    setTimeout(() => playTone(260, 0.06, 'square', 0.08), 40);
  },

  powerUp(): void {
    playSequence([
      [523, 0.07], [659, 0.07], [784, 0.07], [1047, 0.07], [1319, 0.07], [1568, 0.12]
    ], 'square', 0.07);
  },

  hit(): void {
    playSequence([[300, 0.08], [200, 0.12]], 'sawtooth', 0.10);
  },

  die(): void {
    playSequence([
      [494, 0.15], [466, 0.15], [440, 0.15], [330, 0.15], [262, 0.25]
    ], 'triangle', 0.10);
  },

  win(): void {
    playSequence([
      [523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.15],
      [784, 0.1], [1047, 0.25]
    ], 'square', 0.08);
  },

  questionBlock(): void {
    playSequence([[520, 0.04], [780, 0.06], [1040, 0.08]], 'square', 0.06);
  },

  brickBreak(): void {
    playSequence([[400, 0.03], [300, 0.03], [200, 0.04], [150, 0.06]], 'sawtooth', 0.09);
  },

  brickBump(): void {
    playTone(220, 0.06, 'square', 0.07);
  }
};
