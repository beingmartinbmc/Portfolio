import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { environment } from '../../../environments/environment';
import { AI_CONTEXT } from '../../ai-face/ai-context';
import { MarkdownPipe } from '../../shared/markdown.pipe';
import { createOpenAiProxyRequest, getAiResponseText, TTS_API_URL } from '../../config/api-config';
import { firstValueFrom, Subject, Subscription, takeUntil, timeout, TimeoutError } from 'rxjs';
import { cleanTextForSpeech } from '../../utils/text-utils';
import { AchievementsService } from '../../services/achievements.service';
import { AudioService } from '../../services/audio.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./avatar-3d.component.scss']
})
export class Avatar3dComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('chatWindow') chatWindow?: ElementRef<HTMLElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private model!: THREE.Group;
  private animationFrameId?: number;
  private renderObserver?: IntersectionObserver;
  private isInViewport = true;
  private boundResizeHandler = () => this.onWindowResize();
  private boundVisibilityHandler = () => this.updateAnimationState();
  /** False when the browser/environment cannot create a WebGL context (e.g. headless CI). */
  public webglAvailable = true;

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
  public ttsEnabled = false;
  private currentAudio?: HTMLAudioElement;
  private ttsRequest?: Subscription;
  private readonly ttsCache = new Map<string, Blob>();
  private ttsCacheBytes = 0;
  private readonly maxTtsCacheEntries = 12;
  private readonly maxTtsCacheBytes = 8 * 1024 * 1024;
  /**
   * Every chat reply is also billed as Deepgram speech (~$0.03 per 1k characters), so the
   * reply length is capped here rather than left to the shared default. ~600 tokens is roughly
   * 2.4k characters, which also keeps us clear of the gateway's per-request TTS character limit.
   * The system prompt asks for a much shorter answer; this is the backstop if it is ignored.
   */
  private readonly MAX_SPOKEN_REPLY_TOKENS = 600;
  private readonly destroy$ = new Subject<void>();
  private destroyed = false;
  
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // Minimum 1 second between requests
  
  private readonly CONTEXT = AI_CONTEXT;
  private chatTrigger?: HTMLElement;

  constructor(
    private http: HttpClient,
    private achievementsService: AchievementsService,
    private audioService: AudioService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isChatOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeChat();
      return;
    }

    if (event.key !== 'Tab' || !this.chatWindow) {
      return;
    }

    const focusable = Array.from(this.chatWindow.nativeElement.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ));
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ngOnInit(): void {
    if (!this.initThreeJS()) {
      // WebGL unavailable — skip the 3D scene but keep the chat usable.
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }
    this.loadAvatar();
    this.observeRenderVisibility();
    this.updateAnimationState();

  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', this.boundResizeHandler);
    document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    this.renderObserver?.disconnect();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    this.controls?.dispose();
    this.renderer?.dispose();
    
    // Stop any ongoing speech and cleanup
    this.stopSpeech();
  }

  private initThreeJS(): boolean {
    const canvas = this.canvasRef.nativeElement;

    // Bail out early if the environment has no WebGL support (e.g. headless CI,
    // older browsers, GPU disabled). Three.js would otherwise throw on renderer
    // construction and break the whole component.
    const probe = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!probe) {
      this.webglAvailable = false;
      return false;
    }

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
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
      });
    } catch {
      this.webglAvailable = false;
      return false;
    }
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
    return true;
  }

  private loadAvatar(): void {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    
    this.isLoading = true;
    this.loadingProgress = 0;
    this.loadingText = 'Loading 3D Avatar...';
    
    loader.load(
      'assets/3d/avatar.optimized.glb',
      (gltf) => {
        this.model = gltf.scene;
        
        // Update loading text and progress smoothly
        this.loadingProgress = 85; // Ensure we're at 85% before setup
        this.loadingText = 'Setting up 3D scene...';
        this.cdr.markForCheck();

        // Use setTimeout to make progress visible
        setTimeout(() => {
          this.loadingProgress = 90;
          this.cdr.markForCheck();
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
          this.cdr.markForCheck();
        }, 200);
        
        setTimeout(() => {
          this.loadingProgress = 100;
          this.loadingText = 'Ready!';
          this.cdr.markForCheck();

          // Hide loading after final delay
          setTimeout(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          }, 300);
        }, 400);
      },
      (progress) => {
        // Update loading progress with proper bounds checking
        if (progress.total > 0) {
          const rawProgress = (progress.loaded / progress.total) * 85; // Reserve 85% for actual loading
          this.loadingProgress = Math.min(Math.round(rawProgress), 85); // Ensure it never exceeds 85%
          this.loadingText = `Loading 3D Avatar... ${this.loadingProgress}%`;
          this.cdr.markForCheck();
        }
      },
      (error) => {
        console.error('Error loading 3D model:', error);
        this.loadingText = 'Failed to load 3D Avatar';
        this.loadingProgress = 0;
        this.cdr.markForCheck();
        // Hide loading on error after delay
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }, 2000);
      }
    );
  }

  private animate(): void {
    if (!this.renderer || !this.isInViewport || document.hidden) {
      this.animationFrameId = undefined;
      return;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private observeRenderVisibility(): void {
    document.addEventListener('visibilitychange', this.boundVisibilityHandler);

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.renderObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      this.isInViewport = entry.isIntersecting;
      this.updateAnimationState();
    }, { threshold: 0.01 });
    this.renderObserver.observe(this.canvasRef.nativeElement);
  }

  private updateAnimationState(): void {
    const shouldAnimate = this.isInViewport && !document.hidden && !!this.renderer;
    if (shouldAnimate && this.animationFrameId === undefined) {
      this.zone.runOutsideAngular(() => this.animate());
      return;
    }

    if (!shouldAnimate && this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
  }



  // Chat functionality
  public toggleChat(event?: Event): void {
    if (this.isChatOpen) {
      this.closeChat();
      return;
    }

    this.chatTrigger = event?.currentTarget as HTMLElement | undefined;
    this.isChatOpen = true;
    // The click that opened the panel already triggers a CD pass, and the
    // focus below is deferred, so marking dirty is enough here.
    this.cdr.markForCheck();

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

  private closeChat(): void {
    this.isChatOpen = false;
    this.cdr.markForCheck();
    setTimeout(() => this.chatTrigger?.focus());
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
    this.achievementsService.trackAiQuestion();
    this.audioService.play('jump');
    
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
      const response = await firstValueFrom(this.http.post(
        environment.aiApiUrl,
        createOpenAiProxyRequest([
          { role: 'system', content: this.CONTEXT },
          { role: 'user', content: userMessage },
        ], this.MAX_SPOKEN_REPLY_TOKENS),
      ).pipe(
        timeout({ first: 15_000 }),
        takeUntil(this.destroy$),
      ));
      
      const aiResponse = getAiResponseText(response) ?? 'Sorry, I couldn\'t process that. Please try again!';
      
      // Render the answer as soon as chat returns; TTS should not block the chat bubble.
      this.addMessage(aiResponse, false, false);
      this.isTyping = false;
      this.cdr.markForCheck();

      if (this.ttsEnabled) {
        this.speakText(aiResponse);
      }
      
    } catch (error) {
      if (this.destroyed) {
        return;
      }
      console.error('AI request failed:', error);
      const message = error instanceof TimeoutError
        ? 'The AI assistant took too long to respond. Please try again.'
        : 'The AI assistant is temporarily unavailable. Please try again later.';
      this.addMessage(message, false);
      this.isTyping = false;
      this.cdr.markForCheck();
    }
  }

  private addMessage(text: string, isUser: boolean, triggerTTS: boolean = true): void {
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    this.messages.push({ text, isUser, time });
    this.cdr.markForCheck();
    
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
    this.cdr.markForCheck();
    
    // Clean text for speech (remove markdown and special characters)
    const cleanText = cleanTextForSpeech(text);
    
    // Check cache first for instant playback
    const cachedAudio = this.getCachedAudio(cleanText);
    if (cachedAudio) {
      // If we have cached audio, add message immediately since there's no API delay
      if (addMessageAfterTTS) {
        this.addMessage(text, false, false);
        this.isTyping = false; // Stop typing indicator
        this.cdr.markForCheck();
      }
      this.playAudioBlob(cachedAudio);
      return;
    }
    
    // Use regular TTS
    this.speakTextRegular(cleanText, text, addMessageAfterTTS);
  }

  private speakTextRegular(cleanText: string, originalText: string, addMessageAfterTTS: boolean): void {
    this.ttsRequest = this.http.post(TTS_API_URL, {
      text: cleanText
    }, {
      responseType: 'blob'
    }).pipe(
      timeout({ first: 15_000 }),
      takeUntil(this.destroy$),
    ).subscribe({
      next: (response) => {
        if (response && this.isSpeaking) { // Check if still needed
          const audioBlob = response as Blob;
          
          this.cacheAudio(cleanText, audioBlob);
          
          // Add message to UI now that TTS response is ready
          if (addMessageAfterTTS) {
            this.addMessage(originalText, false, false);
            this.isTyping = false; // Stop typing indicator
            this.cdr.markForCheck();
          }
          
          // Play immediately
          this.playAudioBlob(audioBlob);
        }
      },
      error: (error) => {
        console.error('TTS request failed:', error);
        
        // Add message even if TTS fails
        if (addMessageAfterTTS) {
          this.addMessage(originalText, false, false);
          this.isTyping = false; // Stop typing indicator even on error
        }

        this.isSpeaking = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        this.ttsRequest = undefined;
      },
    });
  }

  private getCachedAudio(text: string): Blob | undefined {
    const audio = this.ttsCache.get(text);
    if (audio) {
      this.ttsCache.delete(text);
      this.ttsCache.set(text, audio);
    }
    return audio;
  }

  private cacheAudio(text: string, audio: Blob): void {
    if (audio.size > this.maxTtsCacheBytes) {
      return;
    }

    const existing = this.ttsCache.get(text);
    if (existing) {
      this.ttsCacheBytes -= existing.size;
      this.ttsCache.delete(text);
    }

    while (
      this.ttsCache.size >= this.maxTtsCacheEntries
      || this.ttsCacheBytes + audio.size > this.maxTtsCacheBytes
    ) {
      const oldestKey = this.ttsCache.keys().next().value as string | undefined;
      if (!oldestKey) {
        break;
      }
      const oldestAudio = this.ttsCache.get(oldestKey);
      this.ttsCache.delete(oldestKey);
      this.ttsCacheBytes -= oldestAudio?.size ?? 0;
    }

    this.ttsCache.set(text, audio);
    this.ttsCacheBytes += audio.size;
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
      this.cdr.markForCheck();
    };

    this.currentAudio.onended = () => {
      this.isSpeaking = false;
      this.cleanupAudio();
      this.cdr.markForCheck();
    };

    this.currentAudio.onerror = (error) => {
      console.error('Audio playback error:', error);
      this.isSpeaking = false;
      this.cleanupAudio();
      this.cdr.markForCheck();
    };
    
    // Play immediately - no await
    this.currentAudio.play().catch(error => {
      console.error('Audio play error:', error);
      this.isSpeaking = false;
      this.cleanupAudio();
      this.cdr.markForCheck();
    });
  }


  public toggleTTS(): void {
    this.ttsEnabled = !this.ttsEnabled;
    if (!this.ttsEnabled) {
      this.stopSpeech();
    }
  }

  public stopSpeech(): void {
    this.ttsRequest?.unsubscribe();
    this.ttsRequest = undefined;
    // Stop regular audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.cleanupAudio();
    }
    
    this.isSpeaking = false;
    this.cdr.markForCheck();
  }

  private cleanupAudio(): void {
    if (this.currentAudio) {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(this.currentAudio.src);
      this.currentAudio = undefined;
    }
  }

  private onWindowResize(): void {
    if (!this.renderer) {
      return;
    }
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

  public finalize3DModelAnimation(): void {
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
