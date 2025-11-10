import { Component, ElementRef, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AI_CONTEXT } from './ai-context';
import { MarkdownPipe } from './markdown.pipe';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-ai-face',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MarkdownPipe],
  templateUrl: './ai-face.component.html',
  styleUrls: ['./ai-face.component.scss'],
  animations: [
    trigger('chatAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8) translateY(20px)' }))
      ])
    ])
  ]
})
export class AiFaceComponent implements AfterViewInit {
  @ViewChild('aiFaceContainer', { static: false }) aiFaceContainer!: ElementRef;
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  isChatOpen = false;
  userInput = '';
  messages: Message[] = [];
  isTyping = false;
  isTalking = false;
  hasNewMessage = false;
  mouthPath = 'M55 105 Q80 115 105 105'; // Default smile
  
  private readonly CONTEXT = AI_CONTEXT;

  constructor(private http: HttpClient) {
    // Welcome message
    this.addMessage('Hi! 👋 I\'m Nova, your AI assistant. Ask me anything!', false);
  }

  ngAfterViewInit() {
    this.startIdleAnimation();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    this.hasNewMessage = false;
    
    if (this.isChatOpen) {
      setTimeout(() => {
        if (this.chatMessages) {
          this.scrollToBottom();
        }
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isTyping) return;

    const userMessage = this.userInput.trim();
    this.addMessage(userMessage, true);
    this.userInput = '';
    
    this.isTyping = true;
    this.mouthPath = 'M55 105 Q80 105 105 105'; // Thinking face
    
    try {
      const response = await this.http.post<any>(environment.aiApiUrl, {
        prompt: userMessage,
        context: this.CONTEXT
      }).toPromise();
      
      // Simulate typing delay for more natural feel
      await this.delay(500);
      
      // Parse the response - it comes in data.choices[0].message.content
      let aiResponse = 'Sorry, I couldn\'t process that. Please try again!';
      
      if (response?.data?.choices?.[0]?.message?.content) {
        aiResponse = response.data.choices[0].message.content;
      } else if (response?.response) {
        aiResponse = response.response;
      } else if (response?.message) {
        aiResponse = response.message;
      }
      
      this.addMessage(aiResponse, false);
      
      // Talking animation
      this.isTalking = true;
      this.mouthPath = 'M55 105 Q80 120 105 105'; // Big smile while talking
      setTimeout(() => {
        this.isTalking = false;
        this.mouthPath = 'M55 105 Q80 115 105 105'; // Back to normal smile
      }, 2000);
      
    } catch (error) {
      console.error('AI API Error:', error);
      this.addMessage('Oops! Something went wrong. Please try again later. 😅', false);
      this.mouthPath = 'M55 115 Q80 105 105 115'; // Sad face
      setTimeout(() => {
        this.mouthPath = 'M55 105 Q80 115 105 105';
      }, 2000);
    } finally {
      this.isTyping = false;
    }
  }

  private addMessage(text: string, isUser: boolean) {
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    this.messages.push({ text, isUser, time });
    
    if (!isUser && !this.isChatOpen) {
      this.hasNewMessage = true;
    }
    
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom() {
    if (this.chatMessages) {
      const element = this.chatMessages.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private startIdleAnimation() {
    // Blink animation
    setInterval(() => {
      if (!this.isTyping && !this.isTalking) {
        const leftEye = document.querySelector('#left-eye-container');
        const rightEye = document.querySelector('#right-eye-container');
        
        if (leftEye && rightEye) {
          leftEye.setAttribute('style', 'transform: scaleY(0.1); transform-origin: center;');
          rightEye.setAttribute('style', 'transform: scaleY(0.1); transform-origin: center;');
          
          setTimeout(() => {
            leftEye.setAttribute('style', 'transform: scaleY(1);');
            rightEye.setAttribute('style', 'transform: scaleY(1);');
          }, 150);
        }
      }
    }, 4000);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isTyping || this.isTalking) return;
    
    const svg = document.querySelector('.ai-face-container svg');
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const leftEye = { x: 55, y: 75 };
    const rightEye = { x: 105, y: 75 };
    const radius = 5;

    const getPupilPos = (eye: {x: number, y: number}) => {
      const dx = mouseX - eye.x * (rect.width / 160);
      const dy = mouseY - eye.y * (rect.height / 160);
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.sqrt(dx*dx + dy*dy), radius*3);
      return {
        x: eye.x + Math.cos(angle) * Math.min(dist, radius),
        y: eye.y + Math.sin(angle) * Math.min(dist, radius)
      };
    };

    const left = getPupilPos(leftEye);
    const right = getPupilPos(rightEye);

    const leftPupil = svg.querySelector('#left-pupil') as SVGCircleElement;
    const rightPupil = svg.querySelector('#right-pupil') as SVGCircleElement;
    
    if (leftPupil) {
      leftPupil.setAttribute('cx', left.x.toString());
      leftPupil.setAttribute('cy', left.y.toString());
    }
    if (rightPupil) {
      rightPupil.setAttribute('cx', right.x.toString());
      rightPupil.setAttribute('cy', right.y.toString());
    }
  }
}
