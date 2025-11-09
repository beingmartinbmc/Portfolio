import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
}

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  totalPoints: number;
  timeLeft: number;
}

@Component({
  selector: 'app-ai-quiz-game',
  templateUrl: './ai-quiz-game.component.html',
  styleUrls: ['./ai-quiz-game.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AiQuizGameComponent implements OnInit {
  
  currentQuestion: QuizQuestion | null = null;
  selectedAnswer: number | null = null;
  showAnswer = false;
  isLoading = false;
  gameStarted = false;
  gameEnded = false;
  selectedCategory = 'technology';
  selectedDifficulty = 'Medium';
  questionTimer: any;
  gameTimer: any;
  
  quizStats: QuizStats = {
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    bestStreak: 0,
    totalPoints: 0,
    timeLeft: 30
  };

  categories = [
    { value: 'technology', label: '💻 Technology & Programming', icon: '🚀', description: 'Web dev, programming languages, frameworks' },
    { value: 'science', label: '🧬 Science & Innovation', icon: '⚗️', description: 'Physics, chemistry, biology, discoveries' },
    { value: 'general', label: '🧠 General Knowledge', icon: '🌟', description: 'Mixed topics, current events, facts' },
    { value: 'history', label: '📚 History & Culture', icon: '🏛️', description: 'World history, civilizations, events' },
    { value: 'geography', label: '🌍 Geography & Nature', icon: '🗺️', description: 'Countries, capitals, landmarks, nature' },
    { value: 'sports', label: '⚽ Sports & Games', icon: '🏆', description: 'Sports facts, Olympics, records' }
  ];

  difficulties = [
    { value: 'Easy', label: 'Easy', description: '10 points per question', color: 'success' },
    { value: 'Medium', label: 'Medium', description: '20 points per question', color: 'warning' },
    { value: 'Hard', label: 'Hard', description: '30 points per question', color: 'danger' }
  ];

  // Fallback questions for different categories
  private fallbackQuestions: { [key: string]: QuizQuestion[] } = {
    technology: [
      {
        id: 1,
        question: "Which programming language was created by Brendan Eich in 1995?",
        options: ["Python", "JavaScript", "Java", "C++"],
        correctAnswer: 1,
        explanation: "JavaScript was created by Brendan Eich in just 10 days in 1995 while he was working at Netscape.",
        difficulty: "Medium",
        category: "Technology",
        points: 20
      },
      {
        id: 2,
        question: "What does 'API' stand for in software development?",
        options: ["Application Programming Interface", "Automated Program Integration", "Advanced Programming Instructions", "Application Process Indicator"],
        correctAnswer: 0,
        explanation: "API stands for Application Programming Interface, which allows different software applications to communicate with each other.",
        difficulty: "Easy",
        category: "Technology",
        points: 10
      },
      {
        id: 3,
        question: "Which company developed React.js?",
        options: ["Google", "Microsoft", "Facebook (Meta)", "Twitter"],
        correctAnswer: 2,
        explanation: "React.js was developed by Facebook (now Meta) and was first released in 2013.",
        difficulty: "Medium",
        category: "Technology",
        points: 20
      }
    ],
    science: [
      {
        id: 4,
        question: "What is the chemical symbol for Gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        explanation: "The chemical symbol for Gold is Au, which comes from the Latin word 'aurum' meaning gold.",
        difficulty: "Medium",
        category: "Science",
        points: 20
      },
      {
        id: 5,
        question: "How many chambers does a human heart have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 2,
        explanation: "The human heart has 4 chambers: two atria (upper chambers) and two ventricles (lower chambers).",
        difficulty: "Easy",
        category: "Science",
        points: 10
      }
    ],
    general: [
      {
        id: 6,
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars is called the 'Red Planet' because of its reddish appearance, caused by iron oxide (rust) on its surface.",
        difficulty: "Easy",
        category: "General",
        points: 10
      }
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  async startGame() {
    this.gameStarted = true;
    this.gameEnded = false;
    this.resetQuizStats();
    await this.generateNewQuestion();
    this.startQuestionTimer();
  }

  resetQuizStats() {
    this.quizStats = {
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      totalPoints: 0,
      timeLeft: 30
    };
  }

  async generateNewQuestion() {
    this.isLoading = true;
    this.selectedAnswer = null;
    this.showAnswer = false;
    this.quizStats.timeLeft = 30;

    try {
      // Try to generate AI question first
      const aiQuestion = await this.generateAIQuestion();
      if (aiQuestion) {
        this.currentQuestion = aiQuestion;
      } else {
        // Fallback to pre-loaded questions
        this.currentQuestion = this.getFallbackQuestion();
      }
    } catch (error) {
      console.error('Error generating question:', error);
      this.currentQuestion = this.getFallbackQuestion();
    }

    this.isLoading = false;
  }

  async generateAIQuestion(): Promise<QuizQuestion | null> {
    const prompt = this.generateQuestionPrompt();
    
    try {
      const response = await this.http.post('https://epic-backend-qt7w2jqhj-beingmartinbmcs-projects.vercel.app/api/generic', {
        prompt: prompt,
        context: "Generate a single quiz question with exactly 4 multiple choice options. Follow the exact format specified in the prompt."
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Origin': 'https://beingmartinbmc.github.io'
        })
      }).toPromise();

      if (response && typeof response === 'object' && 'data' in response) {
        const responseData = response.data as any;
        if (responseData && 'choices' in responseData && Array.isArray(responseData.choices) && responseData.choices.length > 0) {
          const aiResponse = responseData.choices[0].message.content;
          return this.parseAIQuestion(aiResponse);
        }
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
    }

    return null;
  }

  generateQuestionPrompt(): string {
    const categoryInfo = this.categories.find(c => c.value === this.selectedCategory);
    const difficultyInfo = this.difficulties.find(d => d.value === this.selectedDifficulty);
    
    return `Generate a ${this.selectedDifficulty} difficulty quiz question about ${categoryInfo?.label}.

STRICT FORMAT REQUIREMENTS:
- Respond with ONLY the formatted question data
- NO additional text, explanations, or markdown
- Use the EXACT format below

FORMAT:
QUESTION: [Your question here]
OPTION_A: [First option]
OPTION_B: [Second option]  
OPTION_C: [Third option]
OPTION_D: [Fourth option]
CORRECT: [Letter of correct answer: A, B, C, or D]
EXPLANATION: [Brief explanation of why the answer is correct]

REQUIREMENTS:
- Make the question challenging but fair for ${this.selectedDifficulty} difficulty
- Ensure all 4 options are plausible and realistic
- Provide a clear, educational explanation
- Keep question and options concise (under 100 characters each)
- Make it interesting and engaging
- Avoid overly obscure or trick questions
- Focus on widely known facts and concepts

Category: ${categoryInfo?.description}
Difficulty: ${this.selectedDifficulty} (${difficultyInfo?.description})

Examples of good questions:
- Technology: "Which company created the TypeScript programming language?"
- Science: "What is the most abundant gas in Earth's atmosphere?"
- General: "Which country has the most time zones?"

Generate ONE question now:`;
  }

  parseAIQuestion(aiResponse: string): QuizQuestion | null {
    try {
      const lines = aiResponse.trim().split('\n').map(line => line.trim());
      
      let question = '';
      let options: string[] = [];
      let correctAnswer = 0;
      let explanation = '';

      for (const line of lines) {
        if (line.startsWith('QUESTION:')) {
          question = line.substring('QUESTION:'.length).trim();
        } else if (line.startsWith('OPTION_A:')) {
          options[0] = line.substring('OPTION_A:'.length).trim();
        } else if (line.startsWith('OPTION_B:')) {
          options[1] = line.substring('OPTION_B:'.length).trim();
        } else if (line.startsWith('OPTION_C:')) {
          options[2] = line.substring('OPTION_C:'.length).trim();
        } else if (line.startsWith('OPTION_D:')) {
          options[3] = line.substring('OPTION_D:'.length).trim();
        } else if (line.startsWith('CORRECT:')) {
          const correctLetter = line.substring('CORRECT:'.length).trim().toUpperCase();
          correctAnswer = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
        } else if (line.startsWith('EXPLANATION:')) {
          explanation = line.substring('EXPLANATION:'.length).trim();
        }
      }

      if (question && options.length === 4 && correctAnswer >= 0 && explanation) {
        const points = this.selectedDifficulty === 'Easy' ? 10 : this.selectedDifficulty === 'Medium' ? 20 : 30;
        return {
          id: Date.now(),
          question,
          options,
          correctAnswer,
          explanation,
          difficulty: this.selectedDifficulty as 'Easy' | 'Medium' | 'Hard',
          category: this.selectedCategory,
          points
        };
      }
    } catch (error) {
      console.error('Error parsing AI question:', error);
    }

    return null;
  }

  getFallbackQuestion(): QuizQuestion {
    const categoryQuestions = this.fallbackQuestions[this.selectedCategory] || this.fallbackQuestions.technology;
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    const question = { ...categoryQuestions[randomIndex], id: Date.now() };
    
    // Update points based on selected difficulty
    const points = this.selectedDifficulty === 'Easy' ? 10 : this.selectedDifficulty === 'Medium' ? 20 : 30;
    question.points = points;
    question.difficulty = this.selectedDifficulty as 'Easy' | 'Medium' | 'Hard';
    
    return question;
  }

  selectAnswer(answerIndex: number) {
    if (this.showAnswer || this.quizStats.timeLeft <= 0) return;
    this.selectedAnswer = answerIndex;
  }

  submitAnswer() {
    if (this.selectedAnswer === null || !this.currentQuestion) return;

    this.showAnswer = true;
    this.clearTimers();
    this.quizStats.totalQuestions++;

    const isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      this.quizStats.correctAnswers++;
      this.quizStats.streak++;
      this.quizStats.bestStreak = Math.max(this.quizStats.bestStreak, this.quizStats.streak);
      
      // Points based on difficulty and time bonus
      let points = this.currentQuestion.points;
      const timeBonus = Math.max(0, Math.floor((this.quizStats.timeLeft / 30) * 10)); // Up to 10 bonus points
      this.quizStats.totalPoints += points + timeBonus;
    } else {
      this.quizStats.streak = 0;
    }
  }

  async nextQuestion() {
    if (this.quizStats.totalQuestions >= 10) {
      this.endGame();
    } else {
      await this.generateNewQuestion();
      this.startQuestionTimer();
    }
  }

  startQuestionTimer() {
    this.quizStats.timeLeft = 30;
    this.questionTimer = setInterval(() => {
      this.quizStats.timeLeft--;
      if (this.quizStats.timeLeft <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  timeUp() {
    if (!this.showAnswer) {
      this.selectedAnswer = -1; // Mark as no answer
      this.submitAnswer();
    }
  }

  clearTimers() {
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
      this.questionTimer = null;
    }
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }

  endGame() {
    this.gameEnded = true;
    this.gameStarted = false;
    this.clearTimers();
  }

  restartGame() {
    this.clearTimers();
    this.gameEnded = false;
    this.startGame();
  }

  getScorePercentage(): number {
    return this.quizStats.totalQuestions > 0 ? 
      Math.round((this.quizStats.correctAnswers / this.quizStats.totalQuestions) * 100) : 0;
  }

  getScoreGrade(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'D';
  }

  getPerformanceMessage(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) return '🌟 Outstanding! You\'re a quiz master!';
    if (percentage >= 80) return '🎉 Excellent work! Very impressive!';
    if (percentage >= 70) return '👍 Good job! You know your stuff!';
    if (percentage >= 60) return '💪 Not bad! Keep learning and improving!';
    return '📚 Great effort! Practice makes perfect!';
  }

  getCategoryIcon(): string {
    return this.categories.find(c => c.value === this.selectedCategory)?.icon || '🎮';
  }

  getCategoryLabel(): string {
    return this.categories.find(c => c.value === this.selectedCategory)?.label || 'Quiz';
  }

  getDifficultyColor(): string {
    return this.difficulties.find(d => d.value === this.selectedDifficulty)?.color || 'primary';
  }

  getTimeBonus(): number {
    return Math.max(0, Math.floor((this.quizStats.timeLeft / 30) * 10));
  }

  getTotalPoints(): number {
    if (!this.currentQuestion) return 0;
    return this.currentQuestion.points + this.getTimeBonus();
  }
}