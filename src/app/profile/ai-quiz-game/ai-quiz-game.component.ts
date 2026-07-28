import { Component, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Subject, takeUntil, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { createOpenAiProxyRequest, getAiResponseText } from '../../config/api-config';
import { MarioEngine } from './game/mario-engine';
import {
  generateProceduralLevel, parseLevelFromAI, buildLevelFromData,
  getLevelGenerationPrompt, validateAILevelData, LevelConfig
} from './game/mario-level-generator';
import { Level, LevelType } from './game/mario-entities';
import { QUIZ_CATEGORIES, QUIZ_DIFFICULTIES, QUIZ_LEVEL_TYPES } from './ai-quiz-game.data';
import { AchievementsService } from '../../services/achievements.service';

type ViewState = 'setup' | 'loading' | 'playing' | 'results';

interface WebkitFullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface WebkitFullscreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void> | void;
  readonly webkitFullscreenElement?: Element | null;
}

@Component({
  selector: 'app-ai-quiz-game',
  templateUrl: './ai-quiz-game.component.html',
  styleUrls: ['./ai-quiz-game.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly destroy$ = new Subject<void>();
  private destroyed = false;

  categories = QUIZ_CATEGORIES;

  difficulties = QUIZ_DIFFICULTIES;

  // The three play modes: each is a full Mario platformer with its own movement style.
  levelTypes = QUIZ_LEVEL_TYPES;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private achievementsService: AchievementsService,
  ) {}

  ngOnDestroy(): void {
    this.destroyed = true;
    this.destroy$.next();
    this.destroy$.complete();
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
    this.cdr.markForCheck();

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

    if (this.destroyed) {
      return;
    }

    this.viewState = 'playing';
    this.cdr.detectChanges();

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.initGame(level));
    });
  }

  private initGame(level: Level): void {
    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement!;

    this.engine = new MarioEngine(canvas, {
      onDeath: () => this.zone.run(() => this.handleDeath()),
      onWin: () => this.zone.run(() => this.handleWin()),
      onScoreChange: (s, c, l) => this.zone.run(() => {
        this.score = s;
        this.coins = c;
        this.lives = l;
        this.cdr.markForCheck();
      }),
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
    this.achievementsService.trackGameScore(this.score);
    this.viewState = 'results';
    this.stopActiveGame();
    this.cdr.markForCheck();
  }

  private handleWin(): void {
    this.won = true;
    this.score = this.engine?.player.score ?? this.score;
    this.enemiesStomped = this.engine?.enemiesStomped ?? 0;
    this.achievementsService.trackGameScore(this.score);
    this.viewState = 'results';
    this.stopActiveGame();
    this.cdr.markForCheck();
  }

  restartGame(): void {
    this.stopActiveGame();
    this.viewState = 'setup';
    this.cdr.markForCheck();
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
    const el = this.wrapperRef?.nativeElement as WebkitFullscreenElement | undefined;
    if (!el) return;

    const fullscreenDocument = document as WebkitFullscreenDocument;

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
        else if (fullscreenDocument.webkitExitFullscreen) await fullscreenDocument.webkitExitFullscreen();
      } catch {
        // ignore
      }
    }
  }

  private handleFullscreenChange(): void {
    const fsEl = document.fullscreenElement
      || (document as WebkitFullscreenDocument).webkitFullscreenElement;
    this.zone.run(() => {
      this.isFullscreen = !!fsEl;
      this.cdr.detectChanges();
    });
    // Re-fit the canvas to the new container size after the layout settles
    requestAnimationFrame(() => this.canvasResize?.());
  }

  private async generateAILevel(config: LevelConfig): Promise<Level | null> {
    const prompt = getLevelGenerationPrompt(this.selectedCategory, this.selectedDifficulty, this.selectedLevelType);
    try {
      const response = await firstValueFrom(this.http.post(
        environment.aiApiUrl,
        createOpenAiProxyRequest([
          { role: 'system', content: 'Return only valid JSON. No markdown. No explanation.' },
          { role: 'user', content: prompt },
        ]),
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      ).pipe(
        timeout({ first: 12_000 }),
        takeUntil(this.destroy$),
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

  handleControlKey(
    event: KeyboardEvent,
    control: 'left' | 'right' | 'jump' | 'fire' | 'down',
    active: boolean,
  ): void {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    const handlers = {
      left: (pressed: boolean) => this.touchLeft(pressed),
      right: (pressed: boolean) => this.touchRight(pressed),
      jump: (pressed: boolean) => this.touchJump(pressed),
      fire: (pressed: boolean) => this.touchFire(pressed),
      down: (pressed: boolean) => this.touchDown(pressed),
    };
    handlers[control](active);
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
