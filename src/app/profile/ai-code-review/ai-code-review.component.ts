import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CODE_REVIEW_PROMPT, CODE_REVIEW_CONTEXT, LANGUAGE_PLACEHOLDERS, COMPLEXITY_ANALYSIS_PROMPT } from './prompts.js';

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
  securityIssues?: string[];
  performanceIssues?: string[];
  complexityAnalysis?: string;
  bestPractices?: string[];
  industryComparison?: {
    standards: string[];
    deviations: string[];
    compliance: number;
  };
  learningResources?: {
    tutorials: string[];
    documentation: string[];
    courses: string[];
    books: string[];
  };
  metrics?: {
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    codeSmells: number;
    technicalDebt: string;
  };
  complexityDetails?: {
    timeComplexity: string;
    spaceComplexity: string;
    algorithmType: string;
    performanceRating: string;
    detailedBreakdown: string;
    optimizationSuggestions: string[];
    comparisonWithOptimal: string;
  };
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
    
    const language = this.getLanguageDisplayName();
    const prompt = CODE_REVIEW_PROMPT(language, this.userCode);
    const context = CODE_REVIEW_CONTEXT(language);

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
          
          // Perform complexity analysis if the code looks like an algorithm
          if (this.isAlgorithmCode(this.userCode)) {
            await this.performComplexityAnalysis();
          }
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
    }
  }

  private isAlgorithmCode(code: string): boolean {
    const algorithmPatterns = [
      /for\s*\(.*\)\s*\{/i,
      /while\s*\(.*\)\s*\{/i,
      /if\s*\(.*\)\s*\{/i,
      /sort/i,
      /search/i,
      /find/i,
      /algorithm/i,
      /complexity/i,
      /recursive/i,
      /loop/i,
      /array/i,
      /list/i,
      /tree/i,
      /graph/i,
      /queue/i,
      /stack/i
    ];
    
    return algorithmPatterns.some(pattern => pattern.test(code));
  }

  async performComplexityAnalysis(): Promise<void> {
    if (!this.userCode.trim()) return;

    const language = this.getLanguageDisplayName();
    const prompt = COMPLEXITY_ANALYSIS_PROMPT(language, this.userCode);

    try {
      const response = await this.http.post('https://epic-backend-myxdxwn4m-beingmartinbmcs-projects.vercel.app/api/generic', {
        prompt: prompt,
        context: `You are an expert algorithm analyst specializing in Big-O complexity analysis for ${language} code.`
      }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Origin': 'https://beingmartinbmc.github.io'
        })
      }).toPromise();

      if (response && typeof response === 'object' && 'data' in response) {
        const responseData = response.data as any;
        if (responseData && 'choices' in responseData && Array.isArray(responseData.choices) && responseData.choices.length > 0) {
          const complexityResponse = responseData.choices[0].message.content;
          this.parseComplexityAnalysis(complexityResponse);
        }
      }
    } catch (error) {
      console.error('Error performing complexity analysis:', error);
    }
  }

  private parseAIResponse(response: string): void {
    // Format the AI response for better display
    this.formattedFeedback = this.formatAIResponse(response);
    
    // Check if response follows our expected format
    const hasStructuredFormat = response.includes('=== CODE QUALITY METRICS ===');
    
    if (hasStructuredFormat) {
      // Use structured parsing
      this.aiReview = {
        feedback: response,
        score: this.extractScore(response),
        improvements: this.extractImprovements(response),
        securityIssues: this.extractSecurityIssues(response),
        performanceIssues: this.extractPerformanceIssues(response),
        complexityAnalysis: this.extractComplexityAnalysis(response),
        bestPractices: this.extractBestPractices(response),
        industryComparison: this.extractIndustryComparison(response),
        learningResources: this.extractLearningResources(response),
        metrics: this.extractMetrics(response)
      };
    } else {
      // Fallback to basic parsing for unstructured responses
      console.warn('AI response does not follow expected format, using fallback parsing');
      this.aiReview = {
        feedback: response,
        score: this.extractScore(response),
        improvements: ["Code Quality", "Best Practices", "Performance"],
        securityIssues: [],
        performanceIssues: [],
        complexityAnalysis: response,
        bestPractices: [],
        industryComparison: { standards: [], deviations: [], compliance: 70 },
        learningResources: { tutorials: [], documentation: [], courses: [], books: [] },
        metrics: { cyclomaticComplexity: 5, maintainabilityIndex: 70, codeSmells: 2, technicalDebt: "Low" }
      };
    }
  }

  private parseComplexityAnalysis(response: string): void {
    if (!this.aiReview) return;

    // Extract complexity analysis data from the response
    const complexityDetails = {
      timeComplexity: this.extractTimeComplexity(response),
      spaceComplexity: this.extractSpaceComplexity(response),
      algorithmType: this.extractAlgorithmType(response),
      performanceRating: this.extractPerformanceRating(response),
      detailedBreakdown: this.extractDetailedBreakdown(response),
      optimizationSuggestions: this.extractOptimizationSuggestions(response),
      comparisonWithOptimal: this.extractComparisonWithOptimal(response)
    };

    this.aiReview.complexityDetails = complexityDetails;
  }

  private extractTimeComplexity(response: string): string {
    const match = response.match(/Time Complexity:\s*([^.\n]+)/i);
    return match ? match[1].trim() : 'O(n) - Unable to determine';
  }

  private extractSpaceComplexity(response: string): string {
    const match = response.match(/Space Complexity:\s*([^.\n]+)/i);
    return match ? match[1].trim() : 'O(1) - Unable to determine';
  }

  private extractAlgorithmType(response: string): string {
    const match = response.match(/Algorithm Type:\s*([^.\n]+)/i);
    return match ? match[1].trim() : 'Unknown algorithm';
  }

  private extractPerformanceRating(response: string): string {
    const match = response.match(/Performance Rating:\s*([^.\n]+)/i);
    return match ? match[1].trim() : 'Unknown performance';
  }

  private extractDetailedBreakdown(response: string): string {
    const match = response.match(/=== DETAILED BREAKDOWN ===\n([^=]*?)(?===|$)/is);
    return match ? match[1].trim() : 'No detailed breakdown available';
  }

  private extractOptimizationSuggestions(response: string): string[] {
    const match = response.match(/=== OPTIMIZATION SUGGESTIONS ===\n([^=]*?)(?===|$)/is);
    if (match) {
      const suggestionsText = match[1];
      const numberedSuggestions = suggestionsText.match(/\d+\.\s*([^.\n]+)/g);
      if (numberedSuggestions) {
        return numberedSuggestions.slice(0, 4).map(suggestion => 
          suggestion.replace(/^\d+\.\s*/, '').trim()
        );
      }
    }
    return ['Consider algorithmic improvements', 'Optimize data structures', 'Reduce complexity'];
  }

  private extractComparisonWithOptimal(response: string): string {
    const match = response.match(/=== COMPARISON WITH OPTIMAL ===\n([^=]*?)(?===|$)/is);
    return match ? match[1].trim() : 'No comparison with optimal solution available';
  }

  private formatAIResponse(response: string): string {
    // If response follows our structured format, extract only the detailed feedback
    if (response.includes('=== DETAILED FEEDBACK ===')) {
      const feedbackMatch = response.match(/=== DETAILED FEEDBACK ===\n([^=]*?)(?===|$)/is);
      if (feedbackMatch) {
        return this.formatDetailedFeedback(feedbackMatch[1].trim());
      }
    }
    
    // Fallback: format the entire response
    return this.formatDetailedFeedback(response);
  }

  private formatDetailedFeedback(text: string): string {
    // Clean up formatting and improve readability
    let formatted = text
      // Remove markdown bold syntax
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert bullet points to proper HTML (handle both • and -)
      .replace(/^[-•]\s*/gm, '<span class="bullet">•</span> ')
      // Convert numbered lists
      .replace(/^\d+\.\s*/gm, '<span class="number">$&</span>')
      // Convert code blocks
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Convert markdown headers to HTML
      .replace(/^#{1,6}\s+(.+)$/gm, '<strong>$1</strong>')
      // Convert tables to readable format
      .replace(/\|(.+)\|/g, '<span class="table-cell">$1</span>')
      // Convert blockquotes
      .replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>')
      // Convert line breaks to HTML
      .replace(/\n/g, '<br>')
      // Clean up extra spaces but preserve structure
      .replace(/\s{2,}/g, ' ')
      .trim();

    return formatted;
  }

  private extractScore(response: string): number {
    // Look for the "OVERALL SCORE" section
    const scoreMatch = response.match(/=== OVERALL SCORE ===\n.*?Score:\s*(\d+)\/10/is);
    if (scoreMatch) {
      return parseInt(scoreMatch[1]);
    }
    
    // Fallback: look for any score pattern
    const fallbackScore = response.match(/(\d+)\/10|score.*?(\d+)/i);
    return fallbackScore ? parseInt(fallbackScore[1] || fallbackScore[2]) : 8;
  }

  private extractImprovements(response: string): string[] {
    // Look for the "KEY IMPROVEMENTS" section
    const improvementsMatch = response.match(/=== KEY IMPROVEMENTS ===\n([^=]*?)(?===|$)/is);
    if (improvementsMatch) {
      const improvementsText = improvementsMatch[1];
      const numberedImprovements = improvementsText.match(/\d+\.\s*([^.\n]+)/g);
      if (numberedImprovements) {
        return numberedImprovements.slice(0, 4).map(imp => 
          imp.replace(/^\d+\.\s*/, '').trim()
        );
      }
    }
    
    // Fallback
    return ["Code Quality", "Best Practices", "Performance"];
  }

  private extractSecurityIssues(response: string): string[] {
    // Look for the "SECURITY ISSUES" section
    const securityMatch = response.match(/=== SECURITY ISSUES ===\n([^=]*?)(?===|$)/is);
    if (securityMatch) {
      const securityText = securityMatch[1];
      const issues = securityText.split('\n').filter(line => line.trim() && !line.includes('==='));
      return issues.slice(0, 3).map(issue => issue.trim());
    }
    return [];
  }

  private extractPerformanceIssues(response: string): string[] {
    // Look for the "PERFORMANCE ISSUES" section
    const performanceMatch = response.match(/=== PERFORMANCE ISSUES ===\n([^=]*?)(?===|$)/is);
    if (performanceMatch) {
      const performanceText = performanceMatch[1];
      const issues = performanceText.split('\n').filter(line => line.trim() && !line.includes('==='));
      return issues.slice(0, 3).map(issue => issue.trim());
    }
    return [];
  }

  private extractComplexityAnalysis(response: string): string {
    // Look for the "DETAILED FEEDBACK" section
    const feedbackMatch = response.match(/=== DETAILED FEEDBACK ===\n([^=]*?)(?===|$)/is);
    if (feedbackMatch) {
      return feedbackMatch[1].trim();
    }
    
    // Fallback: look for any detailed content
    const fallbackMatch = response.match(/detailed[^]*?(?===|$)/is);
    return fallbackMatch ? fallbackMatch[0].trim() : '';
  }

  private extractBestPractices(response: string): string[] {
    // Look for the "BEST PRACTICES" section
    const practicesMatch = response.match(/=== BEST PRACTICES ===\n([^=]*?)(?===|$)/is);
    if (practicesMatch) {
      const practicesText = practicesMatch[1];
      const practices = practicesText.split('\n').filter(line => line.trim() && !line.includes('==='));
      return practices.slice(0, 3).map(practice => practice.trim());
    }
    return [];
  }

  private extractIndustryComparison(response: string): any {
    // Look for the "INDUSTRY STANDARDS" section
    const standardsMatch = response.match(/=== INDUSTRY STANDARDS ===\n([^=]*?)(?===|$)/is);
    if (standardsMatch) {
      const standardsText = standardsMatch[1];
      
      // Extract compliance percentage
      const complianceMatch = standardsText.match(/Compliance:\s*(\d+)%/i);
      const compliance = complianceMatch ? parseInt(complianceMatch[1]) : 75;
      
      // Extract standards met
      const standardsMetMatch = standardsText.match(/Standards Met:\s*([^.\n]+)/i);
      const standards = standardsMetMatch ? 
        standardsMetMatch[1].split(',').map(s => s.trim()) : [];
      
      // Extract deviations
      const deviationsMatch = standardsText.match(/Deviations:\s*([^.\n]+)/i);
      const deviations = deviationsMatch ? 
        deviationsMatch[1].split(',').map(d => d.trim()) : [];
      
      return {
        standards: standards.slice(0, 3),
        deviations: deviations.slice(0, 3),
        compliance: compliance
      };
    }
    return { standards: [], deviations: [], compliance: 75 };
  }

  private extractLearningResources(response: string): any {
    // Look for the "LEARNING RESOURCES" section
    const learningMatch = response.match(/=== LEARNING RESOURCES ===\n([^=]*?)(?===|$)/is);
    if (learningMatch) {
      const learningText = learningMatch[1];
      
      // Extract tutorials
      const tutorialsMatch = learningText.match(/Tutorials:\s*([^.\n]+)/i);
      const tutorials = tutorialsMatch ? 
        tutorialsMatch[1].split(',').map(t => t.trim()) : [];
      
      // Extract documentation
      const docsMatch = learningText.match(/Documentation:\s*([^.\n]+)/i);
      const documentation = docsMatch ? 
        docsMatch[1].split(',').map(d => d.trim()) : [];
      
      // Extract courses
      const coursesMatch = learningText.match(/Courses:\s*([^.\n]+)/i);
      const courses = coursesMatch ? 
        coursesMatch[1].split(',').map(c => c.trim()) : [];
      
      // Extract books
      const booksMatch = learningText.match(/Books:\s*([^.\n]+)/i);
      const books = booksMatch ? 
        booksMatch[1].split(',').map(b => b.trim()) : [];
      
      // If no structured format found, try to parse a single line of resources
      if (tutorials.length === 0 && documentation.length === 0 && courses.length === 0 && books.length === 0) {
        const allResources = learningText.trim().split(',').map(r => r.trim());
        if (allResources.length > 0) {
          // Distribute resources across categories
          const distributed = this.distributeLearningResources(allResources);
          return distributed;
        }
      }
      
      return {
        tutorials: tutorials.slice(0, 2),
        documentation: documentation.slice(0, 2),
        courses: courses.slice(0, 2),
        books: books.slice(0, 2)
      };
    }
    
    return { tutorials: [], documentation: [], courses: [], books: [] };
  }

  private distributeLearningResources(resources: string[]): any {
    const tutorials = [];
    const documentation = [];
    const courses = [];
    const books = [];
    
    resources.forEach((resource, index) => {
      const lowerResource = resource.toLowerCase();
      
      if (lowerResource.includes('documentation') || lowerResource.includes('docs') || lowerResource.includes('api')) {
        documentation.push(resource);
      } else if (lowerResource.includes('course') || lowerResource.includes('tutorial') || lowerResource.includes('guide')) {
        tutorials.push(resource);
      } else if (lowerResource.includes('book') || lowerResource.includes('effective') || lowerResource.includes('practice')) {
        books.push(resource);
      } else {
        // Default distribution based on index
        if (index % 4 === 0) tutorials.push(resource);
        else if (index % 4 === 1) documentation.push(resource);
        else if (index % 4 === 2) courses.push(resource);
        else books.push(resource);
      }
    });
    
    return {
      tutorials: tutorials.slice(0, 2),
      documentation: documentation.slice(0, 2),
      courses: courses.slice(0, 2),
      books: books.slice(0, 2)
    };
  }

  private extractMetrics(response: string): any {
    // Look for the "CODE QUALITY METRICS" section
    const metricsMatch = response.match(/=== CODE QUALITY METRICS ===\n([^=]*?)(?===|$)/is);
    if (metricsMatch) {
      const metricsText = metricsMatch[1];
      
      // Extract cyclomatic complexity
      const complexityMatch = metricsText.match(/Cyclomatic Complexity:\s*(\d+)/i);
      const complexity = complexityMatch ? parseInt(complexityMatch[1]) : 5;
      
      // Extract maintainability index
      const maintainabilityMatch = metricsText.match(/Maintainability Index:\s*(\d+)/i);
      const maintainability = maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 70;
      
      // Extract code smells
      const smellsMatch = metricsText.match(/Code Smells:\s*(\d+)/i);
      const smells = smellsMatch ? parseInt(smellsMatch[1]) : 2;
      
      // Extract technical debt
      const debtMatch = metricsText.match(/Technical Debt:\s*([^.\n]+)/i);
      const debt = debtMatch ? debtMatch[1].trim() : "Low";
      
      return {
        cyclomaticComplexity: complexity,
        maintainabilityIndex: maintainability,
        codeSmells: smells,
        technicalDebt: debt
      };
    }
    
    return { cyclomaticComplexity: 5, maintainabilityIndex: 70, codeSmells: 2, technicalDebt: "Low" };
  }

  // Helper methods for CSS classes
  getComplexityClass(complexity: number): string {
    if (complexity <= 5) return 'metric-good';
    if (complexity <= 10) return 'metric-warning';
    return 'metric-danger';
  }

  getMaintainabilityClass(index: number): string {
    if (index >= 80) return 'metric-good';
    if (index >= 60) return 'metric-warning';
    return 'metric-danger';
  }

  getSmellsClass(smells: number): string {
    if (smells <= 2) return 'metric-good';
    if (smells <= 5) return 'metric-warning';
    return 'metric-danger';
  }

  getDebtClass(debt: string): string {
    const debtLower = debt.toLowerCase();
    if (debtLower.includes('low')) return 'metric-good';
    if (debtLower.includes('medium')) return 'metric-warning';
    return 'metric-danger';
  }

  getStandardAspect(index: number): string {
    const aspects = ['Code Formatting', 'Naming Conventions', 'Documentation', 'Error Handling', 'Testing', 'Performance'];
    return aspects[index] || 'Standard';
  }

  getDeviationAspect(index: number): string {
    const aspects = ['Missing Documentation', 'No Unit Tests', 'Inefficient Algorithm', 'Poor Error Handling', 'Security Issues', 'Performance Issues'];
    return aspects[index] || 'Deviation';
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
