import { Component, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef, HostListener } from '@angular/core';
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
type GameMode = 'runner' | 'platformer' | 'match3';
type RunnerItemKind = 'coin' | 'bug' | 'power';
type RunnerAction = 'run' | 'jump' | 'slide';
type RunnerAvoidAction = 'dodge' | 'jump' | 'slide';

interface RunnerItem {
  id: number;
  lane: number;
  y: number;
  kind: RunnerItemKind;
  label: string;
  avoidAction?: RunnerAvoidAction;
}

interface RunnerPlan {
  theme: string;
  obstacles: string[];
  coins: string[];
  powerUps: string[];
}

interface Match3Plan {
  goal: string;
  tileLabels: string[];
  blockerLabels: string[];
  moves: number;
}

interface MatchTile {
  id: number;
  row: number;
  col: number;
  type: string;
  label: string;
  selected: boolean;
  blocked?: boolean;
  clearing?: boolean;
}

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
  selectedGameMode: GameMode = 'runner';
  selectedCategory = 'backend';
  selectedDifficulty = 'Medium';
  selectedLevelType: LevelType = 'ground';

  score = 0;
  coins = 0;
  lives = 3;

  won = false;
  enemiesStomped = 0;

  private engine: MarioEngine | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private runnerTimerId: number | null = null;
  private runnerActionTimerId: number | null = null;
  private runnerItemId = 0;
  private runnerTicks = 0;
  private matchTileId = 0;

  gameModes: { value: GameMode; label: string; icon: string; description: string }[] = [
    { value: 'runner', label: 'Mario Run', icon: '🏃', description: 'Subway-surfer style lanes with AI-generated bug waves and reward paths' },
    { value: 'platformer', label: 'Mario Gameplay', icon: '🍄', description: 'The full AI-generated platformer: jumps, enemies, coins, and power-ups' },
    { value: 'match3', label: 'Mario Match-3', icon: '🍬', description: 'Candy-crush style engineering puzzles with AI-generated goals and tiles' },
  ];

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

  levelTypes: { value: LevelType; label: string; icon: string; description: string }[] = [
    { value: 'ground', label: 'Ground Run', icon: '🌿', description: 'Classic overworld with staged gaps and grounded enemy waves' },
    { value: 'sky', label: 'Sky Jump', icon: '☁️', description: 'Airy platform chains, higher jumps, and floating routes' },
    { value: 'water', label: 'Water Swim', icon: '🌊', description: 'Underwater movement, dense coins, and safer seabed routes' },
  ];

  runnerLane = 1;
  runnerItems: RunnerItem[] = [];
  runnerDistance = 0;
  runnerTheme = 'AI systems sprint';
  runnerMessage = '';
  runnerAction: RunnerAction = 'run';

  matchTiles: MatchTile[] = [];
  matchGoal = '';
  matchMovesRemaining = 0;
  matchMatches = 0;
  matchTarget = 6;
  matchSelectedIndex: number | null = null;
  matchMessage = '';
  matchPlan: Match3Plan | null = null;

  constructor(private http: HttpClient, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.stopActiveGame();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.viewState !== 'playing' || this.selectedGameMode !== 'runner') return;

    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      event.preventDefault();
      this.moveRunner(-1);
    }

    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      event.preventDefault();
      this.moveRunner(1);
    }

    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w' || event.key === ' ') {
      event.preventDefault();
      this.runnerJump();
    }

    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
      event.preventDefault();
      this.runnerSlide();
    }
  }

  async startGame(): Promise<void> {
    this.stopActiveGame();
    this.viewState = 'loading';
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.won = false;
    this.enemiesStomped = 0;
    this.runnerMessage = '';
    this.matchMessage = '';

    if (this.selectedGameMode === 'runner') {
      await this.startRunnerGame();
      return;
    }

    if (this.selectedGameMode === 'match3') {
      await this.startMatch3Game();
      return;
    }

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

  touchLeft(active: boolean): void {
    if (this.selectedGameMode === 'runner') {
      if (active) this.moveRunner(-1);
      return;
    }
    this.engine?.getControls().setTouchLeft(active);
  }

  touchRight(active: boolean): void {
    if (this.selectedGameMode === 'runner') {
      if (active) this.moveRunner(1);
      return;
    }
    this.engine?.getControls().setTouchRight(active);
  }

  touchJump(active: boolean): void { this.engine?.getControls().setTouchJump(active); }
  touchFire(active: boolean): void { this.engine?.getControls().setTouchFire(active); }

  selectGameMode(mode: GameMode): void {
    this.selectedGameMode = mode;
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

  private async startRunnerGame(): Promise<void> {
    const plan = await this.generateAIRunnerPlan() ?? this.createFallbackRunnerPlan();
    this.runnerTheme = plan.theme;
    this.runnerLane = 1;
    this.runnerItems = [];
    this.runnerDistance = 0;
    this.runnerAction = 'run';
    this.runnerTicks = 0;
    this.runnerItemId = 0;
    this.viewState = 'playing';
    this.cdr.detectChanges();

    this.zone.runOutsideAngular(() => {
      this.runnerTimerId = window.setInterval(() => this.zone.run(() => this.updateRunner(plan)), 95);
    });
  }

  private async startMatch3Game(): Promise<void> {
    const plan = await this.generateAIMatch3Plan() ?? this.createFallbackMatch3Plan();
    this.matchPlan = plan;
    this.matchGoal = plan.goal;
    this.matchMovesRemaining = plan.moves;
    this.matchMatches = 0;
    this.matchTarget = this.selectedDifficulty === 'Easy' ? 5 : this.selectedDifficulty === 'Hard' ? 10 : 7;
    this.matchSelectedIndex = null;
    this.matchTileId = 0;
    this.matchTiles = this.createMatchTiles(plan);
    this.viewState = 'playing';
    this.cdr.detectChanges();
  }

  private async generateAIRunnerPlan(): Promise<RunnerPlan | null> {
    const cat = this.getCategoryLabel();
    const prompt = `Create an AI-generated 3-lane endless runner plan for a Mario-themed "${cat}" world at "${this.selectedDifficulty}" difficulty.
Return JSON only:
{
  "theme": "short arcade theme name",
  "obstacles": ["8-12 short bug or anti-pattern labels"],
  "coins": ["8-12 short reward/concept labels"],
  "powerUps": ["3-5 short power-up concept labels"]
}
Labels must be engineering terms, 1-3 words each.`;

    try {
      const response = await firstValueFrom(this.http.post(
        environment.aiApiUrl,
        createOpenAiProxyRequest([
          { role: 'system', content: 'Return only valid JSON. No markdown. No explanation.' },
          { role: 'user', content: prompt },
        ]),
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      ));
      return this.normalizeRunnerPlan(this.parseAiJson(getAiResponseText(response)));
    } catch (e) {
      console.error('AI runner generation failed:', e);
      return null;
    }
  }

  private async generateAIMatch3Plan(): Promise<Match3Plan | null> {
    const cat = this.getCategoryLabel();
    const prompt = `Create an AI-generated candy-crush style match-3 board plan for a Mario-themed "${cat}" world at "${this.selectedDifficulty}" difficulty.
Return JSON only:
{
  "goal": "one short mission goal",
  "tileLabels": ["6-8 short engineering concept labels"],
  "blockerLabels": ["4-6 short bug or blocker labels"],
  "moves": 18
}
Use realistic engineering terminology. Keep labels 1-2 words.`;

    try {
      const response = await firstValueFrom(this.http.post(
        environment.aiApiUrl,
        createOpenAiProxyRequest([
          { role: 'system', content: 'Return only valid JSON. No markdown. No explanation.' },
          { role: 'user', content: prompt },
        ]),
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) },
      ));
      return this.normalizeMatch3Plan(this.parseAiJson(getAiResponseText(response)));
    } catch (e) {
      console.error('AI match-3 generation failed:', e);
      return null;
    }
  }

  private updateRunner(plan: RunnerPlan): void {
    if (this.viewState !== 'playing' || this.selectedGameMode !== 'runner') return;

    this.runnerTicks++;
    this.runnerDistance += 1;
    this.score += 2;

    if (this.runnerTicks % this.getRunnerSpawnRate() === 0) {
      this.runnerItems.push(this.createRunnerItem(plan));
    }

    const speed = this.selectedDifficulty === 'Hard' ? 4.9 : this.selectedDifficulty === 'Easy' ? 3.3 : 4.1;
    this.runnerItems = this.runnerItems
      .map(item => ({ ...item, y: item.y + speed }))
      .filter(item => {
        if (item.y >= 78 && item.y <= 96 && item.lane === this.runnerLane) {
          this.resolveRunnerCollision(item);
          return false;
        }
        return item.y < 112;
      });

    const finishDistance = this.selectedDifficulty === 'Hard' ? 430 : this.selectedDifficulty === 'Easy' ? 300 : 360;
    if (this.runnerDistance >= finishDistance) {
      this.handleWin();
    }
  }

  private createRunnerItem(plan: RunnerPlan): RunnerItem {
    const roll = Math.random();
    const kind: RunnerItemKind = roll < 0.48 ? 'coin' : roll < 0.88 ? 'bug' : 'power';
    const source = kind === 'coin' ? plan.coins : kind === 'bug' ? plan.obstacles : plan.powerUps;
    const avoidActions: RunnerAvoidAction[] = ['dodge', 'jump', 'slide'];
    return {
      id: this.runnerItemId++,
      lane: Math.floor(Math.random() * 3),
      y: 8,
      kind,
      label: source[this.runnerItemId % source.length] ?? 'Concept',
      avoidAction: kind === 'bug' ? avoidActions[this.runnerItemId % avoidActions.length] : undefined,
    };
  }

  private resolveRunnerCollision(item: RunnerItem): void {
    if (item.kind === 'bug') {
      if (item.avoidAction !== 'dodge' && item.avoidAction === this.runnerAction) {
        this.score += 140;
        this.runnerMessage = item.avoidAction === 'jump' ? `Jumped ${item.label}` : `Slid under ${item.label}`;
        return;
      }

      this.lives -= 1;
      this.runnerMessage = item.avoidAction === 'jump'
        ? `Jump ${item.label}`
        : item.avoidAction === 'slide'
          ? `Slide under ${item.label}`
          : `Dodge ${item.label}`;
      if (this.lives <= 0) {
        this.handleDeath();
      }
      return;
    }

    this.coins += item.kind === 'coin' ? 1 : 3;
    this.score += item.kind === 'coin' ? 75 : 180;
    this.runnerMessage = item.kind === 'coin' ? `Collected ${item.label}` : `Power-up: ${item.label}`;
  }

  moveRunner(delta: number): void {
    this.runnerLane = Math.max(0, Math.min(2, this.runnerLane + delta));
  }

  runnerJump(): void {
    this.setRunnerAction('jump', 520);
  }

  runnerSlide(): void {
    this.setRunnerAction('slide', 560);
  }

  getRunnerItemIcon(item: RunnerItem): string {
    if (item.kind === 'coin') return '🪙';
    if (item.kind === 'power') return '⭐';
    if (item.avoidAction === 'jump') return '🚧';
    if (item.avoidAction === 'slide') return '🚇';
    return '🐛';
  }

  getRunnerItemTransform(item: RunnerItem): string {
    const scale = 0.22 + Math.min(item.y, 100) / 100 * 1.2;
    return `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
  }

  getRunnerItemLeft(item: RunnerItem): number {
    const depth = Math.max(0, Math.min(1, item.y / 100));
    const laneSpread = 5 + depth * 24;
    return 50 + (item.lane - 1) * laneSpread;
  }

  getRunnerItemOpacity(item: RunnerItem): number {
    return Math.max(0.28, Math.min(1, item.y / 42));
  }

  private setRunnerAction(action: RunnerAction, durationMs: number): void {
    this.runnerAction = action;
    if (this.runnerActionTimerId !== null) {
      window.clearTimeout(this.runnerActionTimerId);
    }
    this.runnerActionTimerId = window.setTimeout(() => {
      this.runnerAction = 'run';
      this.runnerActionTimerId = null;
    }, durationMs);
  }

  onMatchTileClick(index: number): void {
    if (this.viewState !== 'playing' || this.selectedGameMode !== 'match3') return;
    if (this.matchTiles[index]?.blocked) {
      this.matchMessage = `Break ${this.matchTiles[index].label} by matching next to it.`;
      return;
    }

    if (this.matchSelectedIndex === null) {
      this.selectMatchTile(index);
      return;
    }

    if (this.matchSelectedIndex === index) {
      this.clearMatchSelection();
      return;
    }

    if (!this.areAdjacent(this.matchSelectedIndex, index)) {
      this.selectMatchTile(index);
      return;
    }

    const firstIndex = this.matchSelectedIndex;
    if (this.matchTiles[firstIndex]?.blocked || this.matchTiles[index]?.blocked) {
      this.matchMessage = 'Blockers cannot be swapped. Clear adjacent candies first.';
      this.clearMatchSelection();
      return;
    }

    this.swapTiles(firstIndex, index);
    this.clearMatchSelection();
    this.matchMovesRemaining--;

    const matched = this.resolveMatch3Board();
    if (!matched) {
      this.swapTiles(firstIndex, index);
      this.matchMessage = 'No match. Try an adjacent swap.';
    }

    if (this.matchMatches >= this.matchTarget) {
      this.handleWin();
    } else if (this.matchMovesRemaining <= 0) {
      this.handleDeath();
    }
  }

  private selectMatchTile(index: number): void {
    this.clearMatchSelection();
    this.matchSelectedIndex = index;
    this.matchTiles[index].selected = true;
  }

  private clearMatchSelection(): void {
    this.matchTiles.forEach(tile => tile.selected = false);
    this.matchSelectedIndex = null;
  }

  private resolveMatch3Board(): boolean {
    let totalCleared = 0;
    let cascades = 0;

    while (cascades < 4) {
      const matches = this.findMatches();
      if (matches.size === 0) break;

      const blockers = this.findAdjacentBlockers(matches);
      const cleared = new Set([...matches, ...blockers]);
      totalCleared += cleared.size;
      cascades++;
      this.applyMatch3Gravity(cleared);
    }

    if (totalCleared === 0) return false;

    this.matchMatches += cascades;
    this.score += totalCleared * 95 + Math.max(0, cascades - 1) * 250;
    this.coins += Math.max(1, Math.floor(totalCleared / 3));
    this.matchMessage = cascades > 1
      ? `Sweet cascade x${cascades}! Cleared ${totalCleared} tiles.`
      : `Sweet! Cleared ${totalCleared} tiles.`;

    return true;
  }

  private findMatches(): Set<number> {
    const matched = new Set<number>();
    const size = 6;

    for (let row = 0; row < size; row++) {
      let runStart = 0;
      for (let col = 1; col <= size; col++) {
        const currentTile = col < size ? this.matchTiles[this.matchIndex(row, col)] : null;
        const previousTile = this.matchTiles[this.matchIndex(row, col - 1)];
        const current = currentTile && !currentTile.blocked ? currentTile.type : null;
        const previous = !previousTile.blocked ? previousTile.type : null;
        if (current !== previous) {
          if (col - runStart >= 3) {
            for (let c = runStart; c < col; c++) matched.add(this.matchIndex(row, c));
          }
          runStart = col;
        }
      }
    }

    for (let col = 0; col < size; col++) {
      let runStart = 0;
      for (let row = 1; row <= size; row++) {
        const currentTile = row < size ? this.matchTiles[this.matchIndex(row, col)] : null;
        const previousTile = this.matchTiles[this.matchIndex(row - 1, col)];
        const current = currentTile && !currentTile.blocked ? currentTile.type : null;
        const previous = !previousTile.blocked ? previousTile.type : null;
        if (current !== previous) {
          if (row - runStart >= 3) {
            for (let r = runStart; r < row; r++) matched.add(this.matchIndex(r, col));
          }
          runStart = row;
        }
      }
    }

    return matched;
  }

  private swapTiles(first: number, second: number): void {
    const firstTile = this.matchTiles[first];
    const secondTile = this.matchTiles[second];
    this.matchTiles[first] = { ...secondTile, row: firstTile.row, col: firstTile.col, selected: false };
    this.matchTiles[second] = { ...firstTile, row: secondTile.row, col: secondTile.col, selected: false };
  }

  private areAdjacent(first: number, second: number): boolean {
    const a = this.matchTiles[first];
    const b = this.matchTiles[second];
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  private createMatchTiles(plan: Match3Plan): MatchTile[] {
    const types = ['api', 'cache', 'queue', 'llm', 'deploy', 'data'];
    const labels = plan.tileLabels.length ? plan.tileLabels : this.createFallbackMatch3Plan().tileLabels;
    const blockers = plan.blockerLabels.length ? plan.blockerLabels : this.createFallbackMatch3Plan().blockerLabels;
    const blockerCount = this.selectedDifficulty === 'Hard' ? 7 : this.selectedDifficulty === 'Easy' ? 3 : 5;
    const blockerIndexes = new Set<number>();
    while (blockerIndexes.size < blockerCount) {
      const index = 6 + Math.floor(Math.random() * 24);
      blockerIndexes.add(index);
    }

    return Array.from({ length: 36 }, (_, id) => {
      const row = Math.floor(id / 6);
      const col = id % 6;
      if (blockerIndexes.has(id)) {
        return {
          id: this.matchTileId++,
          row,
          col,
          type: 'blocker',
          label: blockers[id % blockers.length] ?? 'Bug',
          selected: false,
          blocked: true,
        };
      }

      const type = types[(row * 2 + col + Math.floor(Math.random() * 3)) % types.length];
      return {
        id: this.matchTileId++,
        row,
        col,
        type,
        label: labels[id % labels.length],
        selected: false,
      };
    });
  }

  getMatchTileIcon(tile: MatchTile): string {
    if (tile.blocked) return '🧱';
    const icons: Record<string, string> = {
      api: '🍒',
      cache: '🍋',
      queue: '🍇',
      llm: '🍬',
      deploy: '🍊',
      data: '💎',
    };
    return icons[tile.type] ?? '🍭';
  }

  private findAdjacentBlockers(matches: Set<number>): Set<number> {
    const blockers = new Set<number>();
    matches.forEach(index => {
      const tile = this.matchTiles[index];
      const neighbors = [
        [tile.row - 1, tile.col],
        [tile.row + 1, tile.col],
        [tile.row, tile.col - 1],
        [tile.row, tile.col + 1],
      ];
      neighbors.forEach(([row, col]) => {
        if (row < 0 || row >= 6 || col < 0 || col >= 6) return;
        const neighborIndex = this.matchIndex(row, col);
        if (this.matchTiles[neighborIndex]?.blocked) blockers.add(neighborIndex);
      });
    });
    return blockers;
  }

  private applyMatch3Gravity(cleared: Set<number>): void {
    const nextTiles = [...this.matchTiles];

    for (let col = 0; col < 6; col++) {
      const survivors: MatchTile[] = [];
      for (let row = 5; row >= 0; row--) {
        const index = this.matchIndex(row, col);
        if (!cleared.has(index)) {
          survivors.push(this.matchTiles[index]);
        }
      }

      for (let row = 5; row >= 0; row--) {
        const index = this.matchIndex(row, col);
        const survivor = survivors.shift();
        nextTiles[index] = survivor
          ? { ...survivor, row, col, selected: false, clearing: false }
          : this.createFreshMatchTile(row, col);
      }
    }

    this.matchTiles = nextTiles;
  }

  private createFreshMatchTile(row: number, col: number): MatchTile {
    const plan = this.matchPlan ?? this.createFallbackMatch3Plan();
    const types = ['api', 'cache', 'queue', 'llm', 'deploy', 'data'];
    const labels = plan.tileLabels.length ? plan.tileLabels : this.createFallbackMatch3Plan().tileLabels;
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: this.matchTileId++,
      row,
      col,
      type,
      label: labels[(this.matchTileId + row + col) % labels.length] ?? 'API',
      selected: false,
    };
  }

  private parseAiJson(content: string | null): any {
    if (!content) return null;
    try {
      return JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (!match) return null;
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  }

  private normalizeRunnerPlan(value: any): RunnerPlan | null {
    if (!value) return null;
    const fallback = this.createFallbackRunnerPlan();
    return {
      theme: typeof value.theme === 'string' ? value.theme : fallback.theme,
      obstacles: this.normalizeStringList(value.obstacles, fallback.obstacles),
      coins: this.normalizeStringList(value.coins, fallback.coins),
      powerUps: this.normalizeStringList(value.powerUps, fallback.powerUps),
    };
  }

  private normalizeMatch3Plan(value: any): Match3Plan | null {
    if (!value) return null;
    const fallback = this.createFallbackMatch3Plan();
    const moves = Number.isFinite(value.moves) ? Number(value.moves) : fallback.moves;
    return {
      goal: typeof value.goal === 'string' ? value.goal : fallback.goal,
      tileLabels: this.normalizeStringList(value.tileLabels, fallback.tileLabels),
      blockerLabels: this.normalizeStringList(value.blockerLabels, fallback.blockerLabels),
      moves: Math.max(10, Math.min(28, moves)),
    };
  }

  private normalizeStringList(value: any, fallback: string[]): string[] {
    if (!Array.isArray(value)) return fallback;
    const list = value.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim()).slice(0, 12);
    return list.length ? list : fallback;
  }

  private createFallbackRunnerPlan(): RunnerPlan {
    return {
      theme: `${this.getCategoryLabel()} Sprint`,
      obstacles: ['N+1 Query', 'Timeout', 'Drift', 'Deadlock', 'Bad Prompt', 'Queue Lag', 'OOM', 'Rollback'],
      coins: ['API', 'Cache', 'Retry', 'Index', 'RAG', 'SLO', 'Canary', 'ADR'],
      powerUps: ['Circuit Breaker', 'Autoscale', 'Guardrails', 'Bulkhead'],
    };
  }

  private createFallbackMatch3Plan(): Match3Plan {
    return {
      goal: `Clear ${this.getCategoryLabel()} combos before moves run out`,
      tileLabels: ['API', 'Cache', 'Queue', 'RAG', 'Deploy', 'Index', 'SLO', 'ADR'],
      blockerLabels: ['Timeout', 'Drift', 'Bug', 'Lag'],
      moves: this.selectedDifficulty === 'Easy' ? 22 : this.selectedDifficulty === 'Hard' ? 16 : 19,
    };
  }

  private getRunnerSpawnRate(): number {
    return this.selectedDifficulty === 'Hard' ? 9 : this.selectedDifficulty === 'Easy' ? 14 : 11;
  }

  private matchIndex(row: number, col: number): number {
    return row * 6 + col;
  }

  private stopActiveGame(): void {
    this.engine?.stop();
    this.engine = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.runnerTimerId !== null) {
      window.clearInterval(this.runnerTimerId);
      this.runnerTimerId = null;
    }
    if (this.runnerActionTimerId !== null) {
      window.clearTimeout(this.runnerActionTimerId);
      this.runnerActionTimerId = null;
    }
    this.runnerAction = 'run';
  }

  getCategoryLabel(): string {
    return this.categories.find(c => c.value === this.selectedCategory)?.label || 'World';
  }

  getLevelTypeLabel(): string {
    return this.levelTypes.find(t => t.value === this.selectedLevelType)?.label || 'Ground Run';
  }

  getGameModeLabel(): string {
    return this.gameModes.find(mode => mode.value === this.selectedGameMode)?.label || 'AI Game';
  }

  getResultMessage(): string {
    if (this.won) {
      if (this.selectedGameMode === 'runner') return `Sprint complete. You survived ${this.runnerTheme}.`;
      if (this.selectedGameMode === 'match3') return `Puzzle solved. ${this.matchGoal}`;
      if (this.score >= 1000) return 'Perfect run. That looked like staff-level platforming.';
      if (this.score >= 500) return 'Strong run! You cleared the course with style.';
      return 'Level complete! Nice platforming.';
    }
    return 'Game Over. Every run teaches something — hit restart and try again.';
  }
}
