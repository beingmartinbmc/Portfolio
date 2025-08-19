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
  formattedFeedback = '';
  highlightedCode = '';
  userCode = '';
  selectedLanguage = 'java';
  isLoading = false;
  isGenerating = false;
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
    // Start with empty code editor
    this.userCode = '';
  }

  onCodeChange(): void {
    // Real-time syntax highlighting could be added here
  }

  onLanguageChange(): void {
    // Update placeholder and clear any existing review
    this.aiReview = null;
    this.showReview = false;
  }

  getFileName(): string {
    const extensions: { [key: string]: string } = {
      'java': 'Main.java',
      'javascript': 'script.js',
      'python': 'main.py',
      'typescript': 'script.ts',
      'cpp': 'main.cpp',
      'csharp': 'Program.cs',
      'go': 'main.go',
      'rust': 'main.rs',
      'php': 'index.php',
      'ruby': 'main.rb'
    };
    return extensions[this.selectedLanguage] || 'main.txt';
  }

  getLanguageDisplayName(): string {
    const displayNames: { [key: string]: string } = {
      'java': 'Java',
      'javascript': 'JavaScript',
      'python': 'Python',
      'typescript': 'TypeScript',
      'cpp': 'C++',
      'csharp': 'C#',
      'go': 'Go',
      'rust': 'Rust',
      'php': 'PHP',
      'ruby': 'Ruby'
    };
    return displayNames[this.selectedLanguage] || 'Text';
  }

  getPlaceholderText(): string {
    const placeholders: { [key: string]: string } = {
      'java': `Write your Java code here...
Example:
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
      'javascript': `Write your JavaScript code here...
Example:
function greet(name) {
    return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
      'python': `Write your Python code here...
Example:
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
      'typescript': `Write your TypeScript code here...
Example:
interface User {
    name: string;
    age: number;
}

function greet(user: User): string {
    return \`Hello, \${user.name}!\`;
}`,
      'cpp': `Write your C++ code here...
Example:
#include <iostream>
#include <string>

int main() {
    std::string name = "World";
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
      'csharp': `Write your C# code here...
Example:
using System;

class Program {
    static void Main() {
        string name = "World";
        Console.WriteLine($"Hello, {name}!");
    }
}`,
      'go': `Write your Go code here...
Example:
package main

import "fmt"

func main() {
    name := "World"
    fmt.Printf("Hello, %s!\\n", name)
}`,
      'rust': `Write your Rust code here...
Example:
fn main() {
    let name = "World";
    println!("Hello, {}!", name);
}`,
      'php': `Write your PHP code here...
Example:
<?php
function greet($name) {
    return "Hello, $name!";
}

echo greet("World");
?>`,
      'ruby': `Write your Ruby code here...
Example:
def greet(name)
  "Hello, #{name}!"
end

puts greet("World")`
    };
    return placeholders[this.selectedLanguage] || 'Write your code here...';
  }

  generateRandomCode(): void {
    this.isGenerating = true;
    
    // Simulate generation delay
    setTimeout(() => {
      const randomSnippet = this.getRandomCodeForLanguage(this.selectedLanguage);
      this.userCode = randomSnippet;
      this.isGenerating = false;
    }, 1000);
  }

  getRandomCodeForLanguage(language: string): string {
    const codeSnippets: { [key: string]: string[] } = {
      'java': [
        `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        for(int i = 0; i < arr.length; i++) {
            for(int j = 0; j < arr.length-1; j++) {
                if(arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
    }
}`,
        `@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
}`
      ],
      'javascript': [
        `function bubbleSort(arr) {
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr.length-1; j++) {
            if(arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}`,
        `class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    
    async createUser(user) {
        return await this.userRepository.save(user);
    }
}`
      ],
      'python': [
        `def bubble_sort(arr):
    for i in range(len(arr)):
        for j in range(len(arr)-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
        `class UserService:
    def __init__(self, user_repository):
        self.user_repository = user_repository
    
    def create_user(self, user):
        return self.user_repository.save(user)`
      ],
      'typescript': [
        `function bubbleSort(arr: number[]): number[] {
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr.length-1; j++) {
            if(arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}`,
        `interface User {
    id: number;
    name: string;
    email: string;
}

class UserService {
    constructor(private userRepository: UserRepository) {}
    
    async createUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}`
      ]
    };
    
    const snippets = codeSnippets[language] || codeSnippets['java'];
    return snippets[Math.floor(Math.random() * snippets.length)];
  }

  clearCode(): void {
    this.userCode = '';
    this.aiReview = null;
    this.showReview = false;
  }

  async getAIReview(): Promise<void> {
    if (!this.userCode.trim()) return;

    this.isLoading = true;
    
    const prompt = `Please review this ${this.getLanguageDisplayName()} code and provide:
1. A brief feedback on code quality, best practices, and potential issues
2. 3-4 specific suggestions for improvement
3. A score out of 10 for code quality
4. Areas that could be improved

Code:
${this.userCode}

Please provide a concise, professional review suitable for a portfolio showcase.`;

    const context = `You are an expert ${this.getLanguageDisplayName()} developer and code reviewer. Provide constructive, actionable feedback.`;

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
      this.formattedFeedback = "Great code structure! The implementation follows good practices.<br><br><strong>Suggestions:</strong><br><span class=\"bullet\">•</span> Add error handling<br><span class=\"bullet\">•</span> Consider performance optimization<br><span class=\"bullet\">•</span> Add documentation";
      this.aiReview = {
        feedback: "Great code structure! The implementation follows good practices.",
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
    // Format the AI response for better display
    this.formattedFeedback = this.formatAIResponse(response);
    
    this.aiReview = {
      feedback: response,
      score: this.extractScore(response),
      improvements: ["Code Quality", "Best Practices", "Performance"]
    };
  }

  private formatAIResponse(response: string): string {
    // Clean up markdown formatting and improve readability
    let formatted = response
      // Remove markdown bold syntax
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert bullet points to proper HTML
      .replace(/^[-•]\s*/gm, '<span class="bullet">•</span> ')
      // Convert numbered lists
      .replace(/^\d+\.\s*/gm, '<span class="number">$&</span>')
      // Convert code blocks
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Convert line breaks to HTML
      .replace(/\n/g, '<br>')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();

    return formatted;
  }

  private extractScore(response: string): number {
    const scoreMatch = response.match(/(\d+)\/10|score.*?(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 8;
  }

  resetGame(): void {
    this.userCode = '';
    this.userScore = 0;
    this.totalReviewed = 0;
    this.aiReview = null;
    this.showReview = false;
  }



  private highlightCode(code: string, language: string): string {
    if (language.toLowerCase() === 'java') {
      return this.highlightJava(code);
    }
    return code; // Fallback for unsupported languages
  }

  private highlightJava(code: string): string {
    // IDE-like syntax highlighting
    let highlighted = code
      // Comments first
      .replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>')
      // String literals
      .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
      // Keywords
      .replace(/\b(public|private|protected|static|final|class|interface|extends|implements|import|package|new|return|if|else|for|while|do|switch|case|default|break|continue|try|catch|finally|throw|throws|void|int|long|float|double|boolean|char|byte|short|String|List|Map|Set|ArrayList|HashMap|HashSet)\b/g, '<span class="keyword">$1</span>')
      // Annotations
      .replace(/(@\w+)/g, '<span class="annotation">$1</span>')
      // Method calls (simplified)
      .replace(/(\w+)\s*\(/g, '<span class="method">$1</span>(')
      // Variable types
      .replace(/\b(int|String|boolean|double|float|long|char|byte|short|void)\b/g, '<span class="type">$1</span>')
      // Operators
      .replace(/([+\-*/=<>!&|])/g, '<span class="operator">$1</span>')
      // Brackets
      .replace(/([{}[\]()])/g, '<span class="bracket">$1</span>')
      // Semicolons
      .replace(/;/g, '<span class="semicolon">;</span>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Spaces
      .replace(/ /g, '&nbsp;');
    
    return highlighted;
  }
}
