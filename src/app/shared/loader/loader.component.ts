import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type LoaderVariant = 'mario' | 'pacman' | 'invaders' | 'powerup';

interface VariantMeta {
  sub: string;
  subDone: string;
  phases: [string, string, string, string, string];
  ready: string;
}

const VARIANT_META: Record<LoaderVariant, VariantMeta> = {
  mario: {
    sub: 'NOW LOADING',
    subDone: 'WORLD CLEAR',
    phases: ['Warping pipes...', 'Collecting coins...', 'Spawning power-ups...', 'Loading world 1-1...', 'Almost there...'],
    ready: 'Ready!',
  },
  pacman: {
    sub: 'READY!',
    subDone: 'GAME CLEAR',
    phases: ['Waka waka...', 'Chomping dots...', 'Dodging ghosts...', 'Clearing the maze...', 'One more dot...'],
    ready: 'Cleared!',
  },
  invaders: {
    sub: 'INSERT COIN',
    subDone: 'VICTORY',
    phases: ['Booting cabinet...', 'Targeting invaders...', 'Charging lasers...', 'Defending base...', 'Final wave...'],
    ready: 'Defended!',
  },
  powerup: {
    sub: 'CHARGING',
    subDone: 'MAX POWER',
    phases: ['Gathering energy...', 'Charging core...', 'Stabilizing flux...', 'Overdrive...', 'Almost full...'],
    ready: 'Powered up!',
  },
};

/**
 * Gamified full-screen preloader. On each load it randomly selects one of
 * several arcade-themed templates (Mario coin run, Pac-Man, Space Invaders,
 * Power-Up charge) and fills a pixel progress bar 0 -> 100% before fading out.
 *
 * Append ?loader=pacman (or mario / invaders / powerup) to force a variant.
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="loader" [ngClass]="'theme-' + variant" [class.hiding]="hiding"
           role="status" aria-live="polite"
           [attr.aria-label]="'Loading ' + progress + '%'">
        <div class="loader-stars"></div>

        <div class="loader-inner">
          <div class="brand-mark">&lbrace;&rbrace;</div>
          <div class="loader-title">ANKIT SHARMA</div>
          <div class="loader-sub">{{ sub }}</div>

          <div class="track-wrap">
            @switch (variant) {
              @case ('mario') {
                <div class="coins">
                  @for (c of marks; track c) {
                    <span class="coin" [class.collected]="progress >= c" [style.left.%]="c">🪙</span>
                  }
                </div>
                <div class="runner" [class.cheer]="done" [style.left.%]="progress">🍄</div>
                <div class="flag" [class.raised]="done">🚩</div>
              }
              @case ('pacman') {
                <div class="coins">
                  @for (c of marks; track c) {
                    <span class="pdot" [class.eaten]="progress >= c" [style.left.%]="c"></span>
                  }
                </div>
                <div class="ghost" [style.left.%]="ghostLeft">👻</div>
                <div class="pac" [class.cheer]="done" [style.left.%]="progress"></div>
              }
              @case ('invaders') {
                <div class="coins">
                  @for (c of marks; track c) {
                    <span class="invader" [class.cleared]="progress >= c" [style.left.%]="c">👾</span>
                  }
                </div>
                <div class="cannon" [class.fire]="!done" [style.left.%]="progress">🚀</div>
              }
              @case ('powerup') {
                <div class="orb" [class.full]="done">
                  <span class="core" [style.transform]="coreScale">{{ done ? '🌟' : '⭐' }}</span>
                  @for (b of bolts; track b) {
                    <span class="bolt" [style.--i]="b">⚡</span>
                  }
                </div>
              }
            }

            <div class="track">
              <div class="fill" [style.width.%]="progress">
                <span class="fill-shine"></span>
              </div>
            </div>
          </div>

          <div class="loader-meta">
            <span class="pct">{{ progress }}%</span>
            <span class="phase">{{ phase }}</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loader {
      position: fixed;
      inset: 0;
      z-index: 100001;
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at top left,      rgba(251, 191, 36, 0.14), transparent 30%),
        radial-gradient(circle at top right,     rgba(239, 68, 68, 0.10),  transparent 28%),
        radial-gradient(circle at bottom center, rgba(34, 197, 94, 0.08),  transparent 32%),
        var(--gradient-dark, linear-gradient(180deg, #09091a 0%, #0e0e22 45%, #09091a 100%));
      transition: opacity 0.5s ease, transform 0.5s ease;
      /* Per-theme accents (overridden below) */
      --accent: #fbbf24;
      --accent-grad: linear-gradient(90deg, #d97706 0%, #fbbf24 50%, #fde047 100%);
      --glow: rgba(251, 191, 36, 0.6);
    }

    .theme-mario    { --accent: #fbbf24; --accent-grad: linear-gradient(90deg, #d97706, #fbbf24, #fde047); --glow: rgba(251, 191, 36, 0.6); }
    .theme-pacman   { --accent: #fde047; --accent-grad: linear-gradient(90deg, #eab308, #fde047, #fff59d); --glow: rgba(253, 224, 71, 0.6); }
    .theme-invaders { --accent: #22c55e; --accent-grad: linear-gradient(90deg, #15803d, #22c55e, #4ade80); --glow: rgba(34, 197, 94, 0.55); }
    .theme-powerup  { --accent: #f97316; --accent-grad: linear-gradient(90deg, #dc2626, #f97316, #fbbf24); --glow: rgba(249, 115, 22, 0.6); }

    .loader.hiding {
      opacity: 0;
      transform: scale(1.04);
      pointer-events: none;
    }

    .loader-stars {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(1.5px 1.5px at 12% 22%, rgba(255,255,255,0.7), transparent),
        radial-gradient(1.5px 1.5px at 78% 16%, rgba(255,255,255,0.5), transparent),
        radial-gradient(1.5px 1.5px at 34% 72%, rgba(255,255,255,0.5), transparent),
        radial-gradient(1.5px 1.5px at 64% 60%, rgba(255,255,255,0.45), transparent),
        radial-gradient(1.5px 1.5px at 90% 80%, rgba(255,255,255,0.4), transparent),
        radial-gradient(1.5px 1.5px at 22% 50%, rgba(255,255,255,0.35), transparent);
      opacity: 0.6;
      animation: twinkle 3s ease-in-out infinite alternate;
    }

    @keyframes twinkle { from { opacity: 0.35; } to { opacity: 0.7; } }

    .loader-inner {
      position: relative;
      width: min(440px, 84vw);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .brand-mark {
      font-family: var(--font-pixel);
      font-size: 2.2rem;
      color: var(--accent);
      text-shadow: 0 0 18px var(--glow), 3px 3px 0 rgba(0, 0, 0, 0.45);
      animation: markBob 1.4s ease-in-out infinite;
    }

    @keyframes markBob {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-6px) rotate(2deg); }
    }

    .loader-title {
      margin-top: 0.85rem;
      font-family: var(--font-pixel);
      font-size: 0.78rem;
      letter-spacing: 0.16em;
      color: #f8fafc;
    }

    .loader-sub {
      margin-top: 0.55rem;
      font-family: var(--font-pixel);
      font-size: 0.5rem;
      letter-spacing: 0.34em;
      color: var(--accent);
      animation: blink 1s steps(2, start) infinite;
    }

    @keyframes blink { 50% { opacity: 0.25; } }

    .track-wrap {
      position: relative;
      width: 100%;
      margin-top: 2.6rem;
      padding-bottom: 0.4rem;
    }

    .theme-powerup .track-wrap { margin-top: 4.4rem; }

    /* ── Shared horizontal bar ── */
    .track {
      position: relative;
      width: 100%;
      height: 22px;
      border-radius: 6px;
      background: rgba(9, 9, 26, 0.9);
      border: 2px solid color-mix(in srgb, var(--accent) 38%, transparent);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
      overflow: hidden;
    }

    .fill {
      position: relative;
      height: 100%;
      border-radius: 3px;
      background: var(--accent-grad);
      box-shadow: 0 0 14px var(--glow);
      transition: width 0.12s linear;
      overflow: hidden;
    }

    .fill-shine {
      position: absolute;
      inset: 0;
      background: linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.55) 50%, transparent 80%);
      transform: translateX(-100%);
      animation: shine 1.1s linear infinite;
    }

    @keyframes shine { to { transform: translateX(100%); } }

    /* ── Mario ── */
    .coins { position: absolute; inset: 0 0 auto 0; height: 0; }

    .coin {
      position: absolute; top: -1.55rem; transform: translateX(-50%);
      font-size: 0.85rem;
      filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.6));
      transition: opacity 0.25s ease, transform 0.25s ease;
      animation: coinSpin 1.4s linear infinite;
    }

    @keyframes coinSpin {
      0%, 100% { transform: translateX(-50%) scaleX(1); }
      50% { transform: translateX(-50%) scaleX(0.25); }
    }

    .coin.collected { opacity: 0; transform: translateX(-50%) translateY(-14px) scale(1.4); animation: none; }

    .runner {
      position: absolute; top: -1.65rem; transform: translateX(-50%);
      font-size: 1.35rem; transition: left 0.12s linear;
      animation: hop 0.5s ease-in-out infinite;
      filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4)); z-index: 2;
    }

    @keyframes hop {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-7px); }
    }

    .runner.cheer { animation: cheer 0.6s ease-in-out infinite; }

    @keyframes cheer {
      0%, 100% { transform: translateX(-50%) translateY(0) rotate(-6deg) scale(1.15); }
      50% { transform: translateX(-50%) translateY(-10px) rotate(6deg) scale(1.15); }
    }

    .flag {
      position: absolute; right: -0.4rem; top: -1.5rem; font-size: 1.1rem;
      opacity: 0.5; transform: translateY(4px);
      transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .flag.raised { opacity: 1; transform: translateY(-6px) scale(1.2); filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.7)); }

    /* ── Pac-Man ── */
    .pdot {
      position: absolute; top: -1.35rem; transform: translateX(-50%);
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--accent); box-shadow: 0 0 6px var(--glow);
      transition: opacity 0.15s ease, transform 0.15s ease;
    }

    .pdot.eaten { opacity: 0; transform: translateX(-50%) scale(0.2); }

    .pac {
      position: absolute; top: -1.7rem; transform: translateX(-50%);
      width: 22px; height: 22px; border-radius: 50%; z-index: 2;
      transition: left 0.12s linear;
      background: conic-gradient(from 55deg at 50% 50%, transparent 0 70deg, #fde047 70deg 360deg);
      filter: drop-shadow(0 0 6px rgba(253, 224, 71, 0.7));
      animation: chomp 0.32s steps(1) infinite;
    }

    @keyframes chomp {
      50% { background: conic-gradient(from 85deg at 50% 50%, transparent 0 12deg, #fde047 12deg 360deg); }
    }

    .pac.cheer { animation: none; background: radial-gradient(circle, #fff59d, #fde047 70%); }

    .ghost {
      position: absolute; top: -1.65rem; transform: translateX(-50%);
      font-size: 1.2rem; transition: left 0.12s linear;
      animation: floaty 0.6s ease-in-out infinite;
      filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.5));
    }

    @keyframes floaty {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-4px); }
    }

    /* ── Space Invaders ── */
    .invader {
      position: absolute; top: -1.6rem; transform: translateX(-50%);
      font-size: 1.05rem;
      filter: drop-shadow(0 0 5px rgba(34, 197, 94, 0.55));
      animation: marchY 0.6s steps(2) infinite;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    @keyframes marchY {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(3px); }
    }

    .invader.cleared { opacity: 0; transform: translateX(-50%) scale(1.6) rotate(20deg); animation: none; }

    .cannon {
      position: absolute; top: -1.7rem; transform: translateX(-50%) rotate(-90deg);
      font-size: 1.3rem; transition: left 0.12s linear; z-index: 2;
      filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.6));
    }

    .cannon.fire::after {
      content: '';
      position: absolute; left: 50%; top: -10px;
      width: 2px; height: 12px; transform: translateX(-50%);
      background: linear-gradient(to top, var(--accent), transparent);
      animation: laser 0.4s linear infinite;
    }

    @keyframes laser { 0% { opacity: 1; height: 4px; } 100% { opacity: 0; height: 16px; } }

    /* ── Power-Up charge ── */
    .orb {
      position: absolute; left: 50%; top: -3.4rem; transform: translateX(-50%);
      width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;
    }

    .orb::before {
      content: ''; position: absolute; inset: 0; border-radius: 50%;
      background: radial-gradient(circle, var(--glow), transparent 65%);
      animation: pulse 1.1s ease-in-out infinite;
    }

    .orb.full::before { animation: pulse 0.4s ease-in-out infinite; }

    @keyframes pulse { 0%, 100% { transform: scale(0.85); opacity: 0.7; } 50% { transform: scale(1.2); opacity: 1; } }

    .core {
      position: relative; font-size: 1.8rem; z-index: 2;
      transition: transform 0.15s linear;
      filter: drop-shadow(0 0 10px var(--glow));
    }

    .bolt {
      position: absolute; font-size: 0.8rem; left: 50%; top: 50%;
      transform: rotate(calc(var(--i) * 90deg)) translateX(34px);
      animation: boltFlash 0.7s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.12s);
    }

    @keyframes boltFlash { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }

    /* ── Meta ── */
    .loader-meta {
      display: flex; align-items: baseline; justify-content: space-between;
      width: 100%; margin-top: 1rem;
    }

    .pct {
      font-family: var(--font-pixel); font-size: 1rem;
      color: var(--accent); text-shadow: 0 0 12px var(--glow);
    }

    .phase {
      font-family: var(--font-mono); font-size: 0.72rem;
      color: var(--text-tertiary, #94a3b8); letter-spacing: 0.04em;
    }

    @media (max-width: 600px) {
      .brand-mark { font-size: 1.8rem; }
      .loader-title { font-size: 0.62rem; }
      .pct { font-size: 0.85rem; }
      .phase { font-size: 0.62rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .loader-stars, .brand-mark, .loader-sub, .coin, .runner, .runner.cheer,
      .fill-shine, .pac, .ghost, .invader, .cannon.fire::after, .orb::before, .bolt {
        animation: none;
      }
    }
  `]
})
export class LoaderComponent implements OnInit, OnDestroy {
  variant: LoaderVariant = 'mario';
  progress = 0;
  visible = true;
  hiding = false;
  done = false;

  readonly marks = [20, 40, 60, 80];
  readonly bolts = [0, 1, 2, 3];

  private rafId: number | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private readonly duration = 2200;
  private static readonly LAST_KEY = 'portfolio_loader_last';
  private static readonly VARIANTS: LoaderVariant[] = ['mario', 'pacman', 'invaders', 'powerup'];

  ngOnInit(): void {
    this.variant = this.pickVariant();

    if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') {
      this.progress = 100;
      this.hide();
      return;
    }

    document.body.style.overflow = 'hidden';

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const dur = reduce ? 600 : this.duration;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      this.progress = Math.min(100, Math.round(eased * 100));
      if (t < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.progress = 100;
        this.complete();
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  get sub(): string {
    const meta = VARIANT_META[this.variant];
    return this.done ? meta.subDone : meta.sub;
  }

  get phase(): string {
    const meta = VARIANT_META[this.variant];
    if (this.done) return meta.ready;
    const p = this.progress;
    const i = p < 25 ? 0 : p < 50 ? 1 : p < 75 ? 2 : p < 95 ? 3 : 4;
    return meta.phases[i];
  }

  get ghostLeft(): number {
    return Math.max(0, this.progress - 14);
  }

  get coreScale(): string {
    return `scale(${(0.6 + (this.progress / 100) * 0.7).toFixed(3)})`;
  }

  private pickVariant(): LoaderVariant {
    const all = LoaderComponent.VARIANTS;

    if (typeof window !== 'undefined') {
      const forced = new URLSearchParams(window.location.search).get('loader') as LoaderVariant | null;
      if (forced && all.includes(forced)) {
        return forced;
      }
    }

    let last: string | null = null;
    try {
      last = sessionStorage.getItem(LoaderComponent.LAST_KEY);
    } catch { /* ignore */ }

    const pool = all.length > 1 && last ? all.filter(v => v !== last) : all;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    try {
      sessionStorage.setItem(LoaderComponent.LAST_KEY, chosen);
    } catch { /* ignore */ }

    return chosen;
  }

  private complete(): void {
    this.done = true;
    this.timers.push(setTimeout(() => (this.hiding = true), 520));
    this.timers.push(setTimeout(() => this.hide(), 1080));
  }

  private hide(): void {
    this.visible = false;
    document.body.style.overflow = '';
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.timers.forEach(clearTimeout);
    document.body.style.overflow = '';
  }
}
