import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { environment } from '../../../environments/environment';
import { AI_CONTEXT } from '../../ai-face/ai-context';
import { MarkdownPipe } from '../../ai-face/markdown.pipe';
import { MusicService } from '../../services/music.service';
import { TTS_API_URL } from '../../config/api-config';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Message {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-avatar-3d',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MarkdownPipe],
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
  
  private readonly CONTEXT = AI_CONTEXT;

  constructor(private http: HttpClient) {
    // Welcome message will be added in ngOnInit
  }

  ngOnInit(): void {
    this.initThreeJS();
    this.loadAvatar();
    this.animate();
    
    // Don't add welcome message immediately - wait for chat to open
  }

  ngOnDestroy(): void {
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
    this.scene.background = new THREE.Color(0x1a1a2e);

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

    const fillLight = new THREE.DirectionalLight(0x4080ff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
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
        
        // Update loading text
        this.loadingText = 'Setting up 3D scene...';
        this.loadingProgress = 90;
        
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
        
        // Complete loading
        this.loadingProgress = 100;
        this.loadingText = 'Ready!';
        
        // Hide loading after a short delay
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      (progress) => {
        // Update loading progress
        if (progress.total > 0) {
          this.loadingProgress = Math.round((progress.loaded / progress.total) * 85); // Reserve 85% for actual loading
          this.loadingText = `Loading 3D Avatar... ${this.loadingProgress}%`;
        }
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
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

    const userMessage = this.userInput.trim();
    this.addMessage(userMessage, true);
    this.userInput = '';
    
    this.isTyping = true;
    
    try {
      const response = await this.http.post<any>(environment.aiApiUrl, {
        prompt: userMessage,
        context: this.CONTEXT
      }).toPromise();
      
      let aiResponse = 'Sorry, I couldn\'t process that. Please try again!';
      
      if (response?.data?.choices?.[0]?.message?.content) {
        aiResponse = response.data.choices[0].message.content;
      } else if (response?.response) {
        aiResponse = response.response;
      } else if (response?.message) {
        aiResponse = response.message;
      }
      
      // Immediately add message and start TTS in parallel
      this.addMessage(aiResponse, false, false); // Don't trigger TTS via addMessage
      
      // Start TTS immediately for faster response
      if (this.ttsEnabled) {
        // Don't await TTS to avoid blocking the UI
        this.speakText(aiResponse).catch(error => {
          console.error('TTS failed:', error);
        });
      }
      
    } catch (error) {
      console.error('AI API Error:', error);
      this.addMessage('Oops! Something went wrong. Please try again later. 😅', false);
    } finally {
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

  // Text-to-Speech methods
  private async speakText(text: string): Promise<void> {
    if (!text.trim()) return;

    // Stop any current speech
    this.stopSpeech();

    try {
      this.isSpeaking = true;
      
      // Clean text for speech (remove markdown and special characters)
      const cleanText = this.cleanTextForSpeech(text);
      
      // Call your TTS API with optimized settings for faster response
      const response = await this.http.post(TTS_API_URL, {
        text: cleanText
      }, {
        responseType: 'blob'
      }).toPromise();

      if (response) {
        // Create audio from blob immediately
        const audioBlob = response as Blob;
        const audioUrl = URL.createObjectURL(audioBlob);
        this.currentAudio = new Audio(audioUrl);
        
        // Optimize audio for fastest possible playback
        this.currentAudio.preload = 'auto';
        this.currentAudio.volume = 1.0;
        this.currentAudio.autoplay = false; // Explicitly control playback
        
        // Use promise-based approach for immediate playback
        const playPromise = new Promise<void>((resolve, reject) => {
          this.currentAudio!.oncanplaythrough = () => {
            // Audio can start playing immediately
            this.currentAudio!.play().then(resolve).catch(reject);
          };
          
          this.currentAudio!.onloadeddata = () => {
            // Try to play as soon as some data is loaded
            if (this.currentAudio!.readyState >= 2) { // HAVE_CURRENT_DATA
              this.currentAudio!.play().then(resolve).catch(reject);
            }
          };
          
          this.currentAudio!.onerror = (error) => {
            console.error('Audio load error:', error);
            reject(error);
          };
          
          // Fallback: try to play after a short delay
          setTimeout(() => {
            if (this.currentAudio && this.currentAudio.readyState > 0) {
              this.currentAudio.play().then(resolve).catch(reject);
            }
          }, 100);
        });
        
        // Set up ongoing event handlers
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
        
        // Start loading the audio immediately
        this.currentAudio.load();
        
        // Wait for audio to start playing
        await playPromise;
      }
    } catch (error) {
      console.error('TTS Error:', error);
      this.isSpeaking = false;
    }
  }

  private cleanTextForSpeech(text: string): string {
    // Remove markdown formatting and special characters
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic
      .replace(/`(.*?)`/g, '$1')       // Remove code blocks
      .replace(/#{1,6}\s/g, '')        // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/[#*`_~]/g, '')         // Remove remaining markdown chars
      .replace(/[👋😅🤖💡]/g, '')        // Remove emojis
      .trim();
  }

  public toggleTTS(): void {
    this.ttsEnabled = !this.ttsEnabled;
    if (!this.ttsEnabled) {
      this.stopSpeech();
    }
  }

  public stopSpeech(): void {
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
}
