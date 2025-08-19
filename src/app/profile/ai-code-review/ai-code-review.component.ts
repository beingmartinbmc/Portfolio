import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CodeSnippet {
  id: number;
  title: string;
  language: string;
  code: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

interface AIReview {
  feedback: string;
  suggestions: string[];
  score: number;
  improvements: string[];
}

@Component({
  selector: 'app-ai-code-review',
  templateUrl: './ai-code-review.component.html',
  styleUrls: ['./ai-code-review.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AiCodeReviewComponent implements OnInit {
  
  currentSnippet: CodeSnippet | null = null;
  currentIndex = 0;
  aiReview: AIReview | null = null;
  isLoading = false;
  showReview = false;
  userScore = 0;
  totalReviewed = 0;

  codeSnippets: CodeSnippet[] = [
    {
      id: 1,
      title: "Bubble Sort Implementation",
      language: "Java",
      code: `public void bubbleSort(int[] arr) {
  for(int i = 0; i < arr.length; i++) {
    for(int j = 0; j < arr.length-1; j++) {
      if(arr[j] > arr[j+1]) {
        int temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
}`,
      difficulty: "Easy",
      category: "Algorithms"
    },
    {
      id: 2,
      title: "Spring Boot Service",
      language: "Java",
      code: `@Service
public class UserService {
  @Autowired
  private UserRepository userRepository;
  
  public User createUser(User user) {
    return userRepository.save(user);
  }
  
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }
}`,
      difficulty: "Medium",
      category: "Spring Boot"
    },
    {
      id: 3,
      title: "Kafka Consumer",
      language: "Java",
      code: `@KafkaListener(topics = "user-events")
public void handleUserEvent(String message) {
  try {
    UserEvent event = objectMapper.readValue(message, UserEvent.class);
    processUserEvent(event);
  } catch (Exception e) {
    log.error("Error processing message: " + message, e);
  }
}`,
      difficulty: "Medium",
      category: "Kafka"
    },
    {
      id: 4,
      title: "Redis Cache Service",
      language: "Java",
      code: `@Service
public class CacheService {
  @Autowired
  private RedisTemplate<String, Object> redisTemplate;
  
  public void setValue(String key, Object value) {
    redisTemplate.opsForValue().set(key, value);
  }
  
  public Object getValue(String key) {
    return redisTemplate.opsForValue().get(key);
  }
}`,
      difficulty: "Medium",
      category: "Redis"
    },
    {
      id: 5,
      title: "Microservice Controller",
      language: "Java",
      code: `@RestController
@RequestMapping("/api/users")
public class UserController {
  
  @GetMapping("/{id}")
  public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.findById(id);
    if (user == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(user);
  }
}`,
      difficulty: "Easy",
      category: "REST API"
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNextSnippet();
  }

  loadNextSnippet(): void {
    if (this.currentIndex < this.codeSnippets.length) {
      this.currentSnippet = this.codeSnippets[this.currentIndex];
      this.aiReview = null;
      this.showReview = false;
    }
  }

  async getAIReview(): Promise<void> {
    if (!this.currentSnippet) return;

    this.isLoading = true;
    
    const prompt = `Please review this ${this.currentSnippet.language} code snippet titled "${this.currentSnippet.title}" and provide:
1. A brief feedback on code quality, best practices, and potential issues
2. 3-4 specific suggestions for improvement
3. A score out of 10 for code quality
4. Areas that could be improved

Code:
${this.currentSnippet.code}

Please provide a concise, professional review suitable for a portfolio showcase.`;

    const context = `You are an expert ${this.currentSnippet.language} developer and code reviewer with deep knowledge of ${this.currentSnippet.category}. Provide constructive, actionable feedback.`;

    try {
      const response = await this.http.post('https://epic-backend-myxdxwn4m-beingmartinbmcs-projects.vercel.app/api/generic', {
        prompt: prompt,
        context: context
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
          this.parseAIResponse(aiResponse);
        }
      }
    } catch (error) {
      console.error('Error getting AI review:', error);
      // Fallback to a sample review
      this.aiReview = {
        feedback: "Great code structure! The implementation follows good practices.",
        suggestions: ["Add error handling", "Consider performance optimization", "Add documentation"],
        score: 8,
        improvements: ["Error handling", "Performance", "Documentation"]
      };
    } finally {
      this.isLoading = false;
      this.showReview = true;
      this.totalReviewed++;
    }
  }

  private parseAIResponse(response: string): void {
    // Simple parsing of AI response
    const lines = response.split('\n').filter(line => line.trim());
    
    this.aiReview = {
      feedback: lines[0] || "Good code structure and implementation.",
      suggestions: lines.slice(1, 5).filter(line => line.includes('-') || line.includes('•')),
      score: this.extractScore(response),
      improvements: ["Code Quality", "Best Practices", "Performance"]
    };
  }

  private extractScore(response: string): number {
    const scoreMatch = response.match(/(\d+)\/10|score.*?(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 8;
  }

  nextSnippet(): void {
    this.currentIndex++;
    this.loadNextSnippet();
  }

  previousSnippet(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadNextSnippet();
    }
  }

  resetGame(): void {
    this.currentIndex = 0;
    this.userScore = 0;
    this.totalReviewed = 0;
    this.loadNextSnippet();
  }

  getProgressPercentage(): number {
    return (this.currentIndex / this.codeSnippets.length) * 100;
  }
}
