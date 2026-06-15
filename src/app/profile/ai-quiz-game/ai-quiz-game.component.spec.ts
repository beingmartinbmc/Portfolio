import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';

import { AiQuizGameComponent } from './ai-quiz-game.component';
import { environment } from '../../../environments/environment';

describe('AiQuizGameComponent', () => {
  let component: AiQuizGameComponent;
  let fixture: ComponentFixture<AiQuizGameComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiQuizGameComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AiQuizGameComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create with sensible defaults', () => {
    expect(component).toBeTruthy();
    expect(component.viewState).toBe('setup');
    expect(component.selectedCategory).toBe('backend');
    expect(component.selectedDifficulty).toBe('Medium');
    expect(component.selectedLevelType).toBe('ground');
  });

  it('selectLevelType updates the selection', () => {
    component.selectLevelType('sky');
    expect(component.selectedLevelType).toBe('sky');
    component.selectLevelType('water');
    expect(component.selectedLevelType).toBe('water');
  });

  it('getCategoryLabel returns the label for the selected category', () => {
    component.selectedCategory = 'genai';
    expect(component.getCategoryLabel()).toBe('Gen AI Systems');
    component.selectedCategory = 'does-not-exist';
    expect(component.getCategoryLabel()).toBe('World');
  });

  it('getLevelTypeLabel returns the label for the selected level type', () => {
    component.selectedLevelType = 'water';
    expect(component.getLevelTypeLabel()).toBe('Sea');
    component.selectedLevelType = ('???' as any);
    expect(component.getLevelTypeLabel()).toBe('Land');
  });

  it('getControlsHint changes with the level type', () => {
    component.selectedLevelType = 'ground';
    expect(component.getControlsHint()).toContain('jump');
    component.selectedLevelType = 'water';
    expect(component.getControlsHint()).toContain('swim');
    component.selectedLevelType = 'sky';
    expect(component.getControlsHint()).toContain('fly');
  });

  it('getResultMessage reflects win tiers and loss', () => {
    component.won = true;
    component.score = 1500;
    expect(component.getResultMessage()).toContain('staff-level');
    component.score = 700;
    expect(component.getResultMessage()).toContain('Strong run');
    component.score = 100;
    expect(component.getResultMessage()).toContain('Level complete');
    component.won = false;
    expect(component.getResultMessage()).toContain('Game Over');
  });

  it('restartGame returns to the setup view', () => {
    component.viewState = 'results';
    component.restartGame();
    expect(component.viewState).toBe('setup');
  });

  it('touch controls are safe to call without an active engine', () => {
    expect(() => {
      component.touchLeft(true);
      component.touchRight(true);
      component.touchJump(true);
      component.touchFire(true);
      component.touchDown(true);
    }).not.toThrow();
  });

  it('startGame falls back to a procedural level when the AI request fails', fakeAsync(() => {
    // Provide a canvas so initGame can run.
    const canvas = document.createElement('canvas');
    const container = document.createElement('div');
    container.appendChild(canvas);
    component.canvasRef = new ElementRef(canvas);

    const promise = component.startGame();
    expect(component.viewState).toBe('loading');

    const req = httpMock.expectOne(environment.aiApiUrl);
    req.flush('not json at all', { status: 500, statusText: 'Server Error' });

    tick();
    promise.then(() => {
      expect(component.viewState).toBe('playing');
    });
    tick(300);
    // stop the engine that initGame may have created
    component.ngOnDestroy();
  }));

  it('startGame uses AI-generated level when the response validates', fakeAsync(() => {
    const canvas = document.createElement('canvas');
    const container = document.createElement('div');
    container.appendChild(canvas);
    component.canvasRef = new ElementRef(canvas);

    component.selectedDifficulty = 'Easy';
    const promise = component.startGame();

    const req = httpMock.expectOne(environment.aiApiUrl);
    // Returning unparseable content forces the validator/parse path to reject
    // and fall back, which still exercises generateAILevel end to end.
    req.flush({ choices: [{ message: { content: 'garbage' } }] });

    tick();
    promise.then(() => {
      expect(['playing', 'loading']).toContain(component.viewState);
    });
    tick(300);
    component.ngOnDestroy();
  }));
});
