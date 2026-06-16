import { Component, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { createOpenAiProxyRequest, getAiResponseText } from '../../config/api-config';
import { MarioEngine } from './game/mario-engine';
import {
  generateProceduralLevel, parseLevelFromAI, buildLevelFromData,
  getLevelGenerationPrompt, validateAILevelData, LevelConfig
} from './game/mario-level-generator';
import { LevelType } from './game/mario-entities';

type ViewState = 'setup' | 'loading' | 'playing' | 'results';

@Component({
  selector: 'app-ai-quiz-game',
  templateUrl: './ai-quiz-game.component.html',
  styleUrls: ['./ai-quiz-game.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AiQuizGameComponent implements OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gameWrapper') wrapperRef!: ElementRef<HTMLElement>;

  viewState: ViewState = 'setup';
  selectedCategory = 'backend';
  selectedDifficulty = 'Medium';
  selectedLevelType: LevelType = 'ground';

  score = 0;
  coins = 0;
  lives = 3;

  won = false;
  enemiesStomped = 0;
  isFullscreen = false;

  private engine: MarioEngine | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private fullscreenHandler: (() => void) | null = null;
  private canvasResize: (() => void) | null = null;

  categories = [
    { value: 'backend', label: 'Backend Foundations', icon: '🍄', description: 'APIs, data flows, idempotency, service design' },
    { value: 'distributed', label: 'Distributed Systems', icon: '🚇', description: 'Kafka, queues, caching, consistency, resilience' },
    { value: 'genai', label: 'Gen AI Systems', icon: '🤖', description: 'RAG, evals, prompts, agents, product quality' },
    { value: 'platform', label: 'Platform Engineering', icon: '🛠️', description: 'Observability, CI/CD, reliability, tooling leverage' },
    { value: 'architecture', label: 'System Design', icon: '🏰', description: 'Trade-offs, scale paths, fault tolerance, throughput' },
    { value: 'leadership', label: 'Staff Engineering', icon: '⭐', description: 'Cross-team influence, prioritization, technical leadership' }
  ];

  difficulties = [
    { value: 'Easy', label: 'Warm-Up', description: 'Fewer enemies, more power-ups', color: 'success' },
    { value: 'Medium', label: 'Speed Run', description: 'Balanced challenge', color: 'warning' },
    { value: 'Hard', label: 'Boss Fight', description: 'Dense enemies, big gaps', color: 'danger' }
  ];

  // The three play modes: each is a full Mario platformer with its own movement style.
  levelTypes: { value: LevelType; label: string; icon: string; description: string }[] = [
    { value: 'ground', label: 'Land', icon: '🌿', description: 'Classic overworld — run, jump, and stomp across staged gaps' },
    { value: 'water', label: 'Sea', icon: '🌊', description: 'Dive underwater — swim with buoyant strokes through dense coin trails' },
    { value: 'sky', label: 'Sky', icon: '☁️', description: 'Take flight — hold jump to soar and dive across floating routes' },
  ];

  constructor(private http: HttpClient, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.stopActiveGame();
  }

  async startGame(): Promise<void> {
    this.stopActiveGame();
    this.viewState = 'loading';
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.won = false;
    this.enemiesStomped = 0;

    const config: LevelConfig = {
      difficulty: this.selectedDifficulty,
      category: this.selectedCategory,
      levelType: this.selectedLevelType,
    };

    let level;
    try {
      const [levelResult] = await Promise.allSettled([this.generateAILevel(config)]);
      if (levelResult.status === 'fulfilled' && levelResult.value) {
        level = levelResult.value;
      } else {
        level = generateProceduralLevel(config);
      }
    } catch {
      level = generateProceduralLevel(config);
    }

    this.viewState = 'playing';
    this.cdr.detectChanges();

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.initGame(level));
    });
  }

  private initGame(level: any): void {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement!;

    this.engine = new MarioEngine(canvas, {
      onDeath: () => this.zone.run(() => this.handleDeath()),
      onWin: () => this.zone.run(() => this.handleWin()),
      onScoreChange: (s, c, l) => this.zone.run(() => { this.score = s; this.coins = c; this.lives = l; }),
    });

    const resize = () => {
      const w = container.clientWidth;
      const h = this.isFullscreen
        ? container.clientHeight
        : Math.round(Math.min(w * 0.5625, 480));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      this.engine?.resize(w, h);
    };

    resize();
    this.resizeObserver = new ResizeObserver(resize);
    this.resizeObserver.observe(container);
    this.canvasResize = resize;

    this.engine.loadLevel(level);
    setTimeout(() => this.engine?.start(), 200);

    if (!this.fullscreenHandler) {
      this.fullscreenHandler = () => this.handleFullscreenChange();
      document.addEventListener('fullscreenchange', this.fullscreenHandler);
      document.addEventListener('webkitfullscreenchange', this.fullscreenHandler);
    }
  }

  private handleDeath(): void {
    this.won = false;
    this.enemiesStomped = this.engine?.enemiesStomped ?? 0;
    this.viewState = 'results';
    this.stopActiveGame();
  }

  private handleWin(): void {
    this.won = true;
    this.score = this.engine?.player.score ?? this.score;
    this.enemiesStomped = this.engine?.enemiesStomped ?? 0;
    this.viewState = 'results';
    this.stopActiveGame();
  }

  restartGame(): void {
    this.stopActiveGame();
    this.viewState = 'setup';
  }

  touchLeft(active: boolean): void { this.engine?.getControls().setTouchLeft(active); }
  touchRight(active: boolean): void { this.engine?.getControls().setTouchRight(active); }
  touchJump(active: boolean): void { this.engine?.getControls().setTouchJump(active); }
  touchFire(active: boolean): void { this.engine?.getControls().setTouchFire(active); }
  touchDown(active: boolean): void { this.engine?.getControls().setTouchDown(active); }

  selectLevelType(type: LevelType): void {
    this.selectedLevelType = type;
  }

  async toggleFullscreen(): Promise<void> {
    const el = this.wrapperRef?.nativeElement as any;
    if (!el) return;

    if (!document.fullscreenElement) {
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      } catch {
        // Fullscreen API unavailable / blocked — silently ignore
      }
    } else {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if ((document as any).webkitExitFullscreen) await (document as any).webkitExitFullscreen();
      } catch {
        // ignore
      }
    }
  }

  private handleFullscreenChange(): void {
    const fsEl = document.fullscreenElement || (document as any).webkitFullscreenElement;
    this.zone.run(() => {
      this.isFullscreen = !!fsEl;
      this.cdr.detectChanges();
    });
    // Re-fit the canvas to the new container size after the layout settles
    requestAnimationFrame(() => this.canvasResize?.());
  }

  private async generateAILevel(config: LevelConfig): Promise<any> {
    const prompt = getLevelGenerationPrompt(this.selectedCategory, this.selectedDifficulty, this.selectedLevelType);
    try {
      const response = await firstValueFrom(this.http.post(
        environment.aiApiUrl,
        createOpenAiProxyRequest([
          { role: 'system', content: 'Return only valid JSON. No markdown. No explanation.' },
          { role: 'user', content: prompt },
        ]),
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      ));

      const content = getAiResponseText(response);
      if (content) {
        const parsed = parseLevelFromAI(content);
        if (parsed) {
          const validation = validateAILevelData(parsed, config);
          if (validation.valid) {
            return buildLevelFromData(parsed, config);
          }
          console.warn('AI level rejected by validator:', validation.issues);
        }
      }
    } catch (e) {
      console.error('AI level generation failed:', e);
    }
    return null;
  }

  private stopActiveGame(): void {
    this.engine?.stop();
    this.engine = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.canvasResize = null;

    if (this.fullscreenHandler) {
      document.removeEventListener('fullscreenchange', this.fullscreenHandler);
      document.removeEventListener('webkitfullscreenchange', this.fullscreenHandler);
      this.fullscreenHandler = null;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    this.isFullscreen = false;
  }

  getCategoryLabel(): string {
    return this.categories.find(c => c.value === this.selectedCategory)?.label || 'World';
  }

  getLevelTypeLabel(): string {
    return this.levelTypes.find(t => t.value === this.selectedLevelType)?.label || 'Land';
  }

  getControlsHint(): string {
    if (this.selectedLevelType === 'water') {
      return 'Arrow keys / WASD to move · Space / Up to swim stroke · X / Z / Shift to throw fireballs (fire mode)';
    }
    if (this.selectedLevelType === 'sky') {
      return 'Arrow keys / WASD to move · hold Space / Up to fly higher · Down to dive · X / Z / Shift to throw fireballs (fire mode)';
    }
    return 'Arrow keys / WASD to move · Space / Up to jump · X / Z / Shift to throw fireballs (fire mode)';
  }

  getResultMessage(): string {
    if (this.won) {
      if (this.score >= 1000) return 'Perfect run. That looked like staff-level platforming.';
      if (this.score >= 500) return 'Strong run! You cleared the course with style.';
      return 'Level complete! Nice platforming.';
    }
    return 'Game Over. Every run teaches something — hit restart and try again.';
  }
}
