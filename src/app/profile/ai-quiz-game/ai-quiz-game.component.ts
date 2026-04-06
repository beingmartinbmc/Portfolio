import { Component, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AI_API_URL } from '../../config/api-config';
import { MarioEngine } from './game/mario-engine';
import {
  generateProceduralLevel, parseLevelFromAI, buildLevelFromData,
  getLevelGenerationPrompt, LevelConfig
} from './game/mario-level-generator';

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

  viewState: ViewState = 'setup';
  selectedCategory = 'backend';
  selectedDifficulty = 'Medium';

  score = 0;
  coins = 0;
  lives = 3;

  won = false;
  enemiesStomped = 0;

  private engine: MarioEngine | null = null;
  private resizeObserver: ResizeObserver | null = null;

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

  constructor(private http: HttpClient, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.engine?.stop();
    this.resizeObserver?.disconnect();
  }

  async startGame(): Promise<void> {
    this.viewState = 'loading';
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.won = false;
    this.enemiesStomped = 0;

    const config: LevelConfig = { difficulty: this.selectedDifficulty, category: this.selectedCategory };

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
      const h = Math.round(Math.min(w * 0.5625, 480));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      this.engine?.resize(w, h);
    };

    resize();
    this.resizeObserver = new ResizeObserver(resize);
    this.resizeObserver.observe(container);

    this.engine.loadLevel(level);
    setTimeout(() => this.engine?.start(), 200);
  }

  private handleDeath(): void {
    this.won = false;
    this.enemiesStomped = this.engine?.enemiesStomped ?? 0;
    this.viewState = 'results';
    this.engine?.stop();
  }

  private handleWin(): void {
    this.won = true;
    this.score = this.engine?.player.score ?? this.score;
    this.enemiesStomped = this.engine?.enemiesStomped ?? 0;
    this.viewState = 'results';
    this.engine?.stop();
  }

  restartGame(): void {
    this.engine?.stop();
    this.resizeObserver?.disconnect();
    this.viewState = 'setup';
  }

  touchLeft(active: boolean): void { this.engine?.getControls().setTouchLeft(active); }
  touchRight(active: boolean): void { this.engine?.getControls().setTouchRight(active); }
  touchJump(active: boolean): void { this.engine?.getControls().setTouchJump(active); }
  touchFire(active: boolean): void { this.engine?.getControls().setTouchFire(active); }

  private async generateAILevel(config: LevelConfig): Promise<any> {
    const prompt = getLevelGenerationPrompt(this.selectedCategory, this.selectedDifficulty);
    try {
      const response = await firstValueFrom(this.http.post(AI_API_URL, {
        prompt,
        context: 'Generate a Mario-style level layout as JSON.'
      }, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }));

      if (response && typeof response === 'object' && 'data' in response) {
        const responseData = (response as any).data;
        if (responseData?.choices?.length > 0) {
          const content = responseData.choices[0].message.content;
          const parsed = parseLevelFromAI(content);
          if (parsed) return buildLevelFromData(parsed, config);
        }
      }
    } catch (e) {
      console.error('AI level generation failed:', e);
    }
    return null;
  }

  getCategoryLabel(): string {
    return this.categories.find(c => c.value === this.selectedCategory)?.label || 'World';
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
