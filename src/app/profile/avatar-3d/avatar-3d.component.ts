import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { environment } from '../../../environments/environment';
import { AI_CONTEXT } from '../../ai-face/ai-context';
import { MarkdownPipe } from '../../ai-face/markdown.pipe';
import { getAiResponseText, TTS_API_URL } from '../../config/api-config';
import { trigger, style, transition, animate } from '@angular/animations';
import { firstValueFrom } from 'rxjs';
import { cleanTextForSpeech } from '../../utils/text-utils';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-avatar-3d',
  standalone: true,
  imports: [FormsModule, MarkdownPipe],
  templateUrl: './avatar-3d.component.html',
  styleUrls: ['./avatar-3d.component.scss'],
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
export class Avatar3dComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private model!: THREE.Group;
  private animationFrameId?: number;
  private boundResizeHandler = () => this.onWindowResize();

  // Chat functionality
  public isChatOpen = false;
  public userInput = '';
  public messages: Message[] = [];
  public isTyping = false;
  
  // Loading state
  public isLoading = true;
  public loadingProgress = 0;
  public loadingText = 'Loading 3D Avatar...';
  
  // Text-to-Speech functionality
  public isSpeaking = false;
  public ttsEnabled = true;
  private currentAudio?: HTMLAudioElement;
  private ttsCache = new Map<string, Blob>(); // Cache for faster repeated phrases
  
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // Minimum 1 second between requests
  
  private readonly CONTEXT = AI_CONTEXT;

  constructor(
    private http: HttpClient
  ) {
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isChatOpen) {
      this.isChatOpen = false;
    }
  }

  ngOnInit(): void {
    this.initThreeJS();
    this.loadAvatar();
    this.animate();
    
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.boundResizeHandler);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.controls?.dispose();
    this.renderer?.dispose();
    
    // Stop any ongoing speech and cleanup
    this.stopSpeech();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x09091a);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1, 2);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 5;
    this.controls.target.set(0, 0.5, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffd580, 0.20);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Handle window resize
    window.addEventListener('resize', this.boundResizeHandler);
  }

  private loadAvatar(): void {
    const loader = new GLTFLoader();
    
    this.isLoading = true;
    this.loadingProgress = 0;
    this.loadingText = 'Loading 3D Avatar...';
    
    loader.load(
      'assets/3d/avatar.glb',
      (gltf) => {
        this.model = gltf.scene;
        
        // Update loading text and progress smoothly
        this.loadingProgress = 85; // Ensure we're at 85% before setup
        this.loadingText = 'Setting up 3D scene...';
        
        // Use setTimeout to make progress visible
        setTimeout(() => {
          this.loadingProgress = 90;
        }, 100);
        
        // Center the model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);
        
        // Scale the model to 65% by default
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.275 / maxDim; // 65% of the original 3.5 scale
        this.model.scale.setScalar(scale);
        
        // Enable shadows
        this.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.scene.add(this.model);
        
        // Complete loading with smooth transition
        setTimeout(() => {
          this.loadingProgress = 95;
          this.loadingText = 'Almost ready...';
        }, 200);
        
        setTimeout(() => {
          this.loadingProgress = 100;
          this.loadingText = 'Ready!';
          
          // Hide loading after final delay
          setTimeout(() => {
            this.isLoading = false;
          }, 300);
        }, 400);
      },
      (progress) => {
        // Update loading progress with proper bounds checking
        if (progress.total > 0) {
          const rawProgress = (progress.loaded / progress.total) * 85; // Reserve 85% for actual loading
          this.loadingProgress = Math.min(Math.round(rawProgress), 85); // Ensure it never exceeds 85%
          this.loadingText = `Loading 3D Avatar... ${this.loadingProgress}%`;
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error);
        this.loadingText = 'Failed to load 3D Avatar';
        this.loadingProgress = 0;
        // Hide loading on error after delay
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    );
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }



  // Chat functionality
  public toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    
    if (this.isChatOpen) {
      // Add welcome message when first opening chat
      if (this.messages.length === 0) {
        this.addMessage('Hi! 👋 I\'m your AI assistant. Ask me anything about my portfolio!', false);
      }
      
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

  public async sendMessage(): Promise<void> {
    if (!this.userInput.trim() || this.isTyping) return;

    // Debounce: Prevent rapid successive requests
    const now = Date.now();
    if (now - this.lastRequestTime < this.minRequestInterval) {
      return;
    }
    this.lastRequestTime = now;

    const userMessage = this.userInput.trim();
    this.addMessage(userMessage, true);
    this.userInput = '';
    
    // Prevent multiple concurrent requests
    if (this.isTyping) {
      return;
    }
    
    this.isTyping = true;
    
    await this.fallbackToRegularAPI(userMessage);
  }

  private async fallbackToRegularAPI(userMessage: string): Promise<void> {
    // Ensure we're not already processing
    if (!this.isTyping) {
      return;
    }
    
    try {
      const response = await firstValueFrom(this.http.post<any>(environment.aiApiUrl, {
        message: userMessage,
        context: this.CONTEXT
      }));
      
      const aiResponse = getAiResponseText(response) ?? 'Sorry, I couldn\'t process that. Please try again!';
      
      // Chat and TTS are separate backend APIs: render the chat answer, then synthesize it.
      if (this.ttsEnabled) {
        this.speakText(aiResponse, true);
      } else {
        this.addMessage(aiResponse, false, false);
        this.isTyping = false;
      }
      
    } catch (error) {
      console.error('Fallback API Error:', error);
      this.addMessage('Oops! Something went wrong. Please try again later. 😅', false);
      this.isTyping = false;
    }
  }

  private addMessage(text: string, isUser: boolean, triggerTTS: boolean = true): void {
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    this.messages.push({ text, isUser, time });
    
    // If it's an AI message and TTS is enabled, speak it (only if triggerTTS is true)
    if (!isUser && this.ttsEnabled && triggerTTS) {
      this.speakText(text);
    }
    
    // Scroll to bottom after a short delay
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom(): void {
    if (this.chatMessages) {
      const element = this.chatMessages.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  // Text-to-Speech methods - Simple TTS implementation
  private speakText(text: string, addMessageAfterTTS: boolean = false): void {
    if (!text.trim()) return;

    // Stop any current speech
    this.stopSpeech();
    this.isSpeaking = true;
    
    // Clean text for speech (remove markdown and special characters)
    const cleanText = cleanTextForSpeech(text);
    
    // Check cache first for instant playback
    const cachedAudio = this.ttsCache.get(cleanText);
    if (cachedAudio) {
      // If we have cached audio, add message immediately since there's no API delay
      if (addMessageAfterTTS) {
        this.addMessage(text, false, false);
        this.isTyping = false; // Stop typing indicator
      }
      this.playAudioBlob(cachedAudio);
      return;
    }
    
    // Use regular TTS
    this.speakTextRegular(cleanText, text, addMessageAfterTTS);
  }

  private speakTextRegular(cleanText: string, originalText: string, addMessageAfterTTS: boolean): void {
    // Fire TTS API call immediately
    this.http.post(TTS_API_URL, {
      text: cleanText
    }, {
      responseType: 'blob'
    }).subscribe({
      next: (response) => {
        if (response && this.isSpeaking) { // Check if still needed
          const audioBlob = response as Blob;
          
          // Cache the audio for faster future playback
          this.ttsCache.set(cleanText, audioBlob);
          
          // Add message to UI now that TTS response is ready
          if (addMessageAfterTTS) {
            this.addMessage(originalText, false, false);
            this.isTyping = false; // Stop typing indicator
          }
          
          // Play immediately
          this.playAudioBlob(audioBlob);
        }
      },
      error: (error) => {
        console.error('Regular TTS Error:', error);
        if (error.status === 0 || error.status === undefined) {
          console.error('CORS or network error detected. API might be unreachable.');
          console.error('TTS API URL:', TTS_API_URL);
        } else if (error.status === 404) {
          console.error('TTS API endpoint not found. Check API configuration.');
        } else if (error.status >= 500) {
          console.error('TTS API server error. Service might be down.');
        }
        
        // Add message even if TTS fails
        if (addMessageAfterTTS) {
          this.addMessage(originalText, false, false);
          this.isTyping = false; // Stop typing indicator even on error
        }
        
        this.isSpeaking = false;
      }
    });
  }

  private playAudioBlob(audioBlob: Blob): void {
    const audioUrl = URL.createObjectURL(audioBlob);
    this.currentAudio = new Audio(audioUrl);
    
    // Optimize for fastest playback
    this.currentAudio.preload = 'auto';
    this.currentAudio.volume = 1.0;
    
    // Set up event handlers
    this.currentAudio.onplay = () => {
      this.isSpeaking = true;
    };
    
    this.currentAudio.onended = () => {
      this.isSpeaking = false;
      this.cleanupAudio();
    };
    
    this.currentAudio.onerror = (error) => {
      console.error('Audio playback error:', error);
      this.isSpeaking = false;
      this.cleanupAudio();
    };
    
    // Play immediately - no await
    this.currentAudio.play().catch(error => {
      console.error('Audio play error:', error);
      this.isSpeaking = false;
      this.cleanupAudio();
    });
  }


  public toggleTTS(): void {
    this.ttsEnabled = !this.ttsEnabled;
    if (!this.ttsEnabled) {
      this.stopSpeech();
    }
  }

  public stopSpeech(): void {
    // Stop regular audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.cleanupAudio();
    }
    
    this.isSpeaking = false;
  }

  private cleanupAudio(): void {
    if (this.currentAudio) {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(this.currentAudio.src);
      this.currentAudio = undefined;
    }
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  // Getters for template bindings
  public get isReallyTyping(): boolean {
    return this.isTyping;
  }

  public get isReallySpeaking(): boolean {
    return this.isSpeaking;
  }

  // 3D Model animation methods for voice synchronization
  public prepare3DModelForSpeech(): void {
    if (this.model) {
      // Add subtle animation to indicate the avatar is preparing to speak
      // You can enhance this with actual mouth animation or other visual cues
      this.addSubtleSpeakingAnimation();
    }
  }

  public finalize3DModelAnimation(timing?: any, performance?: any): void {
    if (this.model) {
      this.removeSpeakingAnimation();
    }
  }

  private addSubtleSpeakingAnimation(): void {
    // Simple breathing or idle animation while speaking
    // You can expand this to include mouth movements, eye blinking, etc.
    if (this.model) {
      const originalY = this.model.position.y;
      const amplitude = 0.005; // Very subtle movement
      const frequency = 0.02;
      
      const animate = () => {
        if (this.isReallySpeaking && this.model) {
          this.model.position.y = originalY + Math.sin(Date.now() * frequency) * amplitude;
          requestAnimationFrame(animate);
        } else if (this.model) {
          // Return to original position
          this.model.position.y = originalY;
        }
      };
      animate();
    }
  }

  private removeSpeakingAnimation(): void {
    // No-op: extensible for future model animation resets
  }
}
