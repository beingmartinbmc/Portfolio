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
    
    const prompt = `Please provide a comprehensive code review for this ${this.getLanguageDisplayName()} code:

**Code Quality Metrics:**
- Calculate cyclomatic complexity and maintainability index
- Identify code smells and anti-patterns
- Assess technical debt and code quality metrics
- Evaluate readability and structure

**Security Vulnerability Scan:**
- Check for SQL injection, XSS, CSRF vulnerabilities
- Identify input validation and authentication issues
- Assess data handling and encryption practices
- Suggest security hardening measures

**Performance Optimization Analysis:**
- Analyze time and space complexity (Big O notation)
- Identify performance bottlenecks and memory leaks
- Suggest algorithm optimizations and caching strategies
- Assess resource management and scalability

**Best Practices Compliance:**
- Check against ${this.getLanguageDisplayName()} industry standards
- Identify deviations from language-specific conventions
- Assess design patterns and architectural decisions
- Suggest modern development practices

**Industry Standards Comparison:**
- Compare against industry best practices for ${this.getLanguageDisplayName()}
- Identify compliance gaps and deviations
- Assess code quality against professional standards
- Provide compliance percentage

**Learning Path Recommendations:**
- Suggest relevant tutorials and documentation
- Recommend online courses and learning resources
- Suggest books and advanced materials
- Provide specific improvement areas to focus on

**Overall Assessment:**
- Provide a score out of 10 for code quality
- List 3-4 specific actionable improvements
- Highlight the most critical issues to address
- Provide a summary of key findings

Code to review:
${this.userCode}

Please provide a structured, professional review with specific metrics, comparisons, and learning recommendations suitable for a portfolio showcase.`;

    const context = `You are an expert ${this.getLanguageDisplayName()} developer, security specialist, performance engineer, and code reviewer with deep knowledge of:
- Industry best practices and coding standards
- Security vulnerabilities and mitigation strategies
- Performance optimization and scalability
- Code quality metrics and maintainability
- Modern development patterns and architectural decisions
- Learning resources and educational materials

Provide comprehensive, actionable feedback with specific metrics, comparisons, and learning recommendations.`;

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
    }
  }

  private parseAIResponse(response: string): void {
    // Format the AI response for better display
    this.formattedFeedback = this.formatAIResponse(response);
    
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
  }

  private formatAIResponse(response: string): string {
    // Clean up markdown formatting and improve readability
    let formatted = response
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
      // Convert line breaks to HTML
      .replace(/\n/g, '<br>')
      // Clean up extra spaces but preserve structure
      .replace(/\s{2,}/g, ' ')
      .trim();

    return formatted;
  }

  private extractScore(response: string): number {
    const scoreMatch = response.match(/(\d+)\/10|score.*?(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2]) : 8;
  }

  private extractImprovements(response: string): string[] {
    // Look for the "Key Improvements" section specifically
    const keyImprovementsMatch = response.match(/key improvements?[:\s]*\n?([^•]*?)(?=most critical|summary|overall assessment|$)/is);
    
    if (keyImprovementsMatch) {
      const improvementsText = keyImprovementsMatch[1];
      // Extract numbered improvements
      const numberedImprovements = improvementsText.match(/\d+\.\s*([^.\n]+)/g);
      if (numberedImprovements) {
        return numberedImprovements.slice(0, 4).map(imp => 
          imp.replace(/^\d+\.\s*/, '').trim()
        );
      }
    }
    
    // Fallback: look for bullet points or other patterns
    const bulletImprovements = response.match(/^[-•]\s*([^.\n]+)/gm);
    if (bulletImprovements) {
      return bulletImprovements.slice(0, 4).map(imp => 
        imp.replace(/^[-•]\s*/, '').trim()
      );
    }
    
    // Final fallback
    return ["Code Quality", "Best Practices", "Performance"];
  }

  private extractSecurityIssues(response: string): string[] {
    const securitySection = response.match(/security[^]*?(?=performance|best practices|overall|$)/i);
    if (securitySection) {
      const issues = securitySection[0].match(/(?:vulnerability|risk|issue)[s]?[:\s]+([^.\n]+)/gi);
      return issues ? issues.slice(0, 3).map(issue => issue.replace(/^(?:vulnerability|risk|issue)[s]?[:\s]+/i, '').trim()) : [];
    }
    return [];
  }

  private extractPerformanceIssues(response: string): string[] {
    const performanceSection = response.match(/performance[^]*?(?=best practices|overall|$)/i);
    if (performanceSection) {
      const issues = performanceSection[0].match(/(?:bottleneck|optimization|complexity)[:\s]+([^.\n]+)/gi);
      return issues ? issues.slice(0, 3).map(issue => issue.replace(/^(?:bottleneck|optimization|complexity)[:\s]+/i, '').trim()) : [];
    }
    return [];
  }

  private extractComplexityAnalysis(response: string): string {
    // Look for the "Code Quality Metrics" section specifically
    const metricsSection = response.match(/code quality metrics[^]*?(?=security|performance|best practices|overall|$)/is);
    if (metricsSection) {
      return metricsSection[0].substring(0, 300) + '...';
    }
    
    // Fallback: look for complexity-related content
    const complexityMatch = response.match(/complexity[^]*?(?=security|performance|best practices|overall|$)/is);
    return complexityMatch ? complexityMatch[0].substring(0, 200) + '...' : '';
  }

  private extractBestPractices(response: string): string[] {
    const bestPracticesSection = response.match(/best practices[^]*?(?=overall|$)/i);
    if (bestPracticesSection) {
      const practices = bestPracticesSection[0].match(/(?:practice|standard|guideline)[:\s]+([^.\n]+)/gi);
      return practices ? practices.slice(0, 3).map(practice => practice.replace(/^(?:practice|standard|guideline)[:\s]+/i, '').trim()) : [];
    }
    return [];
  }

  private extractIndustryComparison(response: string): any {
    const comparisonSection = response.match(/industry standards[^]*?(?=learning|overall|$)/i);
    if (comparisonSection) {
      const standards = comparisonSection[0].match(/(?:standard|convention|guideline)[:\s]+([^.\n]+)/gi);
      const deviations = comparisonSection[0].match(/(?:deviation|gap|violation)[:\s]+([^.\n]+)/gi);
      const complianceMatch = comparisonSection[0].match(/(\d+)%|compliance.*?(\d+)/i);
      
      return {
        standards: standards ? standards.slice(0, 3).map(s => s.replace(/^(?:standard|convention|guideline)[:\s]+/i, '').trim()) : [],
        deviations: deviations ? deviations.slice(0, 3).map(d => d.replace(/^(?:deviation|gap|violation)[:\s]+/i, '').trim()) : [],
        compliance: complianceMatch ? parseInt(complianceMatch[1] || complianceMatch[2]) : 75
      };
    }
    return { standards: [], deviations: [], compliance: 75 };
  }

  private extractLearningResources(response: string): any {
    // Look for the "Learning Path Recommendations" section specifically
    const learningSection = response.match(/learning path recommendations?[^]*?(?=overall assessment|summary|$)/is);
    if (learningSection) {
      const sectionText = learningSection[0];
      
      // Extract tutorials
      const tutorialsMatch = sectionText.match(/tutorials?[:\s]*\n?([^•]*?)(?=courses|books|documentation|$)/is);
      const tutorials = tutorialsMatch ? 
        tutorialsMatch[1].match(/•\s*([^.\n]+)/g)?.map(t => t.replace(/^•\s*/, '').trim()) || [] : [];
      
      // Extract documentation
      const docsMatch = sectionText.match(/documentation[:\s]*\n?([^•]*?)(?=courses|books|tutorials|$)/is);
      const documentation = docsMatch ? 
        docsMatch[1].match(/•\s*([^.\n]+)/g)?.map(d => d.replace(/^•\s*/, '').trim()) || [] : [];
      
      // Extract courses
      const coursesMatch = sectionText.match(/courses?[:\s]*\n?([^•]*?)(?=books|tutorials|documentation|$)/is);
      const courses = coursesMatch ? 
        coursesMatch[1].match(/•\s*([^.\n]+)/g)?.map(c => c.replace(/^•\s*/, '').trim()) || [] : [];
      
      // Extract books
      const booksMatch = sectionText.match(/books?[:\s]*\n?([^•]*?)(?=courses|tutorials|documentation|$)/is);
      const books = booksMatch ? 
        booksMatch[1].match(/•\s*([^.\n]+)/g)?.map(b => b.replace(/^•\s*/, '').trim()) || [] : [];
      
      return {
        tutorials: tutorials.slice(0, 2),
        documentation: documentation.slice(0, 2),
        courses: courses.slice(0, 2),
        books: books.slice(0, 2)
      };
    }
    
    // Fallback: look for any learning-related content
    const fallbackLearning = response.match(/learning[^]*?(?=overall|summary|$)/is);
    if (fallbackLearning) {
      const text = fallbackLearning[0];
      const links = text.match(/\[([^\]]+)\]\([^)]+\)/g);
      const resources = links ? links.map(link => link.replace(/\[([^\]]+)\]\([^)]+\)/, '$1')) : [];
      
      return {
        tutorials: resources.slice(0, 1),
        documentation: resources.slice(1, 2),
        courses: [],
        books: []
      };
    }
    
    return { tutorials: [], documentation: [], courses: [], books: [] };
  }

  private extractMetrics(response: string): any {
    // Look for the "Code Quality Metrics" section specifically
    const metricsSection = response.match(/code quality metrics[^]*?(?=security|performance|best practices|$)/is);
    if (metricsSection) {
      const sectionText = metricsSection[0];
      
      // Extract cyclomatic complexity - look for actual complexity values
      const complexityMatch = sectionText.match(/cyclomatic complexity[:\s]*(\d+(?:\.\d+)?)/i);
      const complexityValue = complexityMatch ? parseFloat(complexityMatch[1]) : 5;
      
      // Extract maintainability index - look for percentage or score
      const maintainabilityMatch = sectionText.match(/maintainability[:\s]*(\d+)/i);
      const maintainabilityValue = maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 70;
      
      // Extract code smells count
      const smellsMatch = sectionText.match(/smells?[:\s]*(\d+)/i);
      const smellsValue = smellsMatch ? parseInt(smellsMatch[1]) : 2;
      
      // Extract technical debt level
      const debtMatch = sectionText.match(/debt[:\s]+([^.\n]+)/i);
      const debtValue = debtMatch ? debtMatch[1].trim() : "Low";
      
      return {
        cyclomaticComplexity: Math.round(complexityValue),
        maintainabilityIndex: maintainabilityValue,
        codeSmells: smellsValue,
        technicalDebt: debtValue
      };
    }
    
    // Fallback: look for any metrics-related content
    const fallbackMetrics = response.match(/metrics[^]*?(?=security|performance|$)/is);
    if (fallbackMetrics) {
      const text = fallbackMetrics[0];
      const complexityMatch = text.match(/complexity[:\s]*(\d+(?:\.\d+)?)/i);
      const maintainabilityMatch = text.match(/maintainability[:\s]*(\d+)/i);
      const smellsMatch = text.match(/smells?[:\s]*(\d+)/i);
      const debtMatch = text.match(/debt[:\s]+([^.\n]+)/i);
      
      return {
        cyclomaticComplexity: complexityMatch ? Math.round(parseFloat(complexityMatch[1])) : 5,
        maintainabilityIndex: maintainabilityMatch ? parseInt(maintainabilityMatch[1]) : 70,
        codeSmells: smellsMatch ? parseInt(smellsMatch[1]) : 2,
        technicalDebt: debtMatch ? debtMatch[1].trim() : "Low"
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
