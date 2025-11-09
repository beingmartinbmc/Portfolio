import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { AiQuizGameComponent } from './ai-quiz-game.component';

describe('AiQuizGameComponent', () => {
  let component: AiQuizGameComponent;
  let fixture: ComponentFixture<AiQuizGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiQuizGameComponent, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiQuizGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default settings', () => {
    expect(component.selectedCategory).toBe('technology');
    expect(component.selectedDifficulty).toBe('Medium');
    expect(component.gameStarted).toBeFalse();
    expect(component.gameEnded).toBeFalse();
  });

  it('should start game correctly', () => {
    spyOn(component, 'generateNewQuestion').and.returnValue(Promise.resolve());
    spyOn(component, 'startQuestionTimer');
    
    component.startGame();
    
    expect(component.gameStarted).toBeTrue();
    expect(component.gameEnded).toBeFalse();
    expect(component.generateNewQuestion).toHaveBeenCalled();
  });

  it('should calculate score percentage correctly', () => {
    component.quizStats.totalQuestions = 10;
    component.quizStats.correctAnswers = 8;
    expect(component.getScorePercentage()).toBe(80);
  });

  it('should assign correct grade based on percentage', () => {
    component.quizStats.totalQuestions = 10;
    component.quizStats.correctAnswers = 9;
    expect(component.getScoreGrade()).toBe('A+');
    
    component.quizStats.correctAnswers = 8;
    expect(component.getScoreGrade()).toBe('A');
    
    component.quizStats.correctAnswers = 7;
    expect(component.getScoreGrade()).toBe('B');
  });

  it('should select answer correctly', () => {
    component.selectAnswer(2);
    expect(component.selectedAnswer).toBe(2);
  });

  it('should not allow answer selection when time is up', () => {
    component.quizStats.timeLeft = 0;
    component.selectAnswer(1);
    expect(component.selectedAnswer).toBeNull();
  });

  it('should reset quiz stats properly', () => {
    component.quizStats.totalQuestions = 5;
    component.quizStats.correctAnswers = 3;
    component.quizStats.totalPoints = 100;
    
    component.resetQuizStats();
    
    expect(component.quizStats.totalQuestions).toBe(0);
    expect(component.quizStats.correctAnswers).toBe(0);
    expect(component.quizStats.totalPoints).toBe(0);
    expect(component.quizStats.timeLeft).toBe(30);
  });
});