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
import { TTS_API_URL, STREAMING_VOICE_API_URL } from '../../config/api-config';
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
  private ttsCache = new Map<string, Blob>(); // Cache for faster repeated phrases
  public streamingEnabled = true; // Enable streaming voice by default
  private audioContext?: AudioContext;
  private audioSource?: AudioBufferSourceNode;
  
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
    
    // Clean up audio context
    if (this.audioContext) {
      this.audioContext.close();
    }
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
        console.log('Loading progress:', Math.min((progress.loaded / progress.total * 100), 100) + '%');
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
      
      // Start TTS and display message only when audio is ready
      if (this.ttsEnabled) {
        // Don't add message to UI yet - wait for TTS response
        // Keep typing indicator active until message is displayed
        this.speakText(aiResponse, true); // Pass true to indicate we should add message after TTS
      } else {
        // If TTS is disabled, add message immediately and stop typing
        this.addMessage(aiResponse, false, false);
        this.isTyping = false;
      }
      
    } catch (error) {
      console.error('AI API Error:', error);
      this.addMessage('Oops! Something went wrong. Please try again later. 😅', false);
      this.isTyping = false;
    }
    // Note: isTyping will be set to false when message is actually displayed
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

  // Text-to-Speech methods - Optimized for minimal latency with streaming support
  private speakText(text: string, addMessageAfterTTS: boolean = false): void {
    if (!text.trim()) return;

    // Stop any current speech
    this.stopSpeech();
    this.isSpeaking = true;
    
    // Clean text for speech (remove markdown and special characters)
    const cleanText = this.cleanTextForSpeech(text);
    
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
    
    // Use streaming voice if enabled, fallback to regular TTS
    if (this.streamingEnabled) {
      this.speakTextStreaming(cleanText, text, addMessageAfterTTS);
    } else {
      this.speakTextRegular(cleanText, text, addMessageAfterTTS);
    }
  }

  private speakTextStreaming(cleanText: string, originalText: string, addMessageAfterTTS: boolean): void {
    // Add message immediately when starting streaming (better UX)
    if (addMessageAfterTTS) {
      this.addMessage(originalText, false, false);
      this.isTyping = false;
    }

    console.log('🎵 Starting streaming voice for:', cleanText);

    // Start streaming voice with correct API structure
    fetch(STREAMING_VOICE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://beingmartinbmc.github.io'
      },
      body: JSON.stringify({
        prompt: cleanText,
        context: "You are Nova, an AI assistant on Ankit Sharma's portfolio website.",
        voiceSettings: {
          model: "aura-2-draco-en",
          chunkSize: 20
        }
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Streaming API error: ${response.status}`);
      }
      
      console.log('✅ Streaming API response received');
      
      // Handle Server-Sent Events streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming not supported');
      }

      // Process Server-Sent Events audio stream
      this.processSSEAudioStream(reader, cleanText);
    })
    .catch(error => {
      console.error('❌ Streaming TTS Error:', error);
      // Fallback to regular TTS
      this.speakTextRegular(cleanText, originalText, false); // Don't add message again
    });
  }

  private async processSSEAudioStream(reader: ReadableStreamDefaultReader<Uint8Array>, cleanText: string): Promise<void> {
    const decoder = new TextDecoder();
    let buffer = '';
    let eventType = '';
    const audioChunks: { chunkIndex: number; audio: string }[] = [];
    
    try {
      console.log('📡 Starting to process SSE stream...');
      
      while (this.isSpeaking) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('📡 Stream ended');
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
            console.log('📡 Event:', eventType);
          } else if (line.startsWith('data: ') && line.slice(6).trim()) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log('📦 Data:', eventType, data);
              
              switch (eventType) {
                case 'text':
                  // Text streaming - we already display the message
                  console.log('📝 Text chunk:', data.content);
                  break;
                  
                case 'audio':
                  audioChunks.push({
                    chunkIndex: data.chunkIndex,
                    audio: data.audio
                  });
                  console.log('🎵 Audio chunk received:', data.chunkIndex, 'Total chunks:', audioChunks.length);
                  
                  // Start playing audio as soon as we have the first chunk
                  if (audioChunks.length === 1) {
                    this.playStreamingAudioChunks(audioChunks, cleanText);
                  }
                  break;
                  
                case 'done':
                  console.log('✅ Stream done. Total audio chunks:', audioChunks.length);
                  // If we haven't started playing yet (no audio chunks), cache what we have
                  if (audioChunks.length === 0) {
                    console.log('⚠️ No audio chunks received');
                  }
                  break;
              }
            } catch (e) {
              console.warn('Parse error:', e, line);
            }
          }
        }
      }
      
      // Cache the complete audio for future use
      if (audioChunks.length > 0) {
        const completeAudio = await this.mergeBase64AudioChunks(audioChunks);
        this.ttsCache.set(cleanText, completeAudio);
        console.log('💾 Cached complete audio for future use');
      }
      
    } catch (error) {
      console.error('❌ SSE stream processing error:', error);
    } finally {
      reader.releaseLock();
    }
  }

  private async playStreamingAudioChunks(audioChunks: { chunkIndex: number; audio: string }[], cleanText: string): Promise<void> {
    console.log('🔊 Starting to play streaming audio chunks:', audioChunks.length);
    
    try {
      // Sort chunks by index to ensure correct order
      const sortedChunks = audioChunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
      
      for (let i = 0; i < sortedChunks.length; i++) {
        if (!this.isSpeaking) {
          console.log('🛑 Playback stopped by user');
          break;
        }
        
        const chunk = sortedChunks[i];
        console.log(`🎵 Playing chunk ${i + 1}/${sortedChunks.length} (index: ${chunk.chunkIndex})`);
        
        try {
          await this.playBase64AudioChunk(chunk.audio);
          console.log(`✅ Played chunk ${i + 1} successfully`);
        } catch (error) {
          console.error(`❌ Failed to play chunk ${i + 1}:`, error);
          // Continue with next chunk instead of stopping
        }
        
        // Small delay between chunks for smoother playback
        if (i < sortedChunks.length - 1) {
          await this.delay(50);
        }
      }
      
      console.log('🎉 Streaming audio playback complete');
      this.isSpeaking = false;
      
    } catch (error) {
      console.error('❌ Streaming audio playback error:', error);
      this.isSpeaking = false;
    }
  }

  private async playBase64AudioChunk(base64Audio: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Convert base64 to blob
        const byteCharacters = atob(base64Audio);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        
        audio.play().catch(reject);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  private async mergeBase64AudioChunks(chunks: { chunkIndex: number; audio: string }[]): Promise<Blob> {
    // Sort chunks by index to ensure correct order
    const sortedChunks = chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
    
    // Convert all base64 chunks to byte arrays
    const byteArrays: Uint8Array[] = [];
    let totalLength = 0;
    
    for (const chunk of sortedChunks) {
      const byteCharacters = atob(chunk.audio);
      const byteArray = new Uint8Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      
      byteArrays.push(byteArray);
      totalLength += byteArray.length;
    }
    
    // Merge all byte arrays into one
    const merged = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const byteArray of byteArrays) {
      merged.set(byteArray, offset);
      offset += byteArray.length;
    }
    
    return new Blob([merged], { type: 'audio/mpeg' });
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

  public toggleStreaming(): void {
    this.streamingEnabled = !this.streamingEnabled;
    console.log(`Streaming voice ${this.streamingEnabled ? 'enabled' : 'disabled'}`);
  }

  public stopSpeech(): void {
    console.log('🛑 Stopping all speech/audio');
    
    // Stop regular audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.cleanupAudio();
    }
    
    // Stop legacy streaming audio (Web Audio API)
    if (this.audioSource) {
      this.audioSource.stop();
      this.audioSource = undefined;
    }
    
    // Set flag to stop streaming playback
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
