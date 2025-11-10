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
  private mixer?: THREE.AnimationMixer;
  private animations: THREE.AnimationAction[] = [];
  private clock = new THREE.Clock();
  
  // Animation state
  public isTalking = false;
  private headBob = 0;
  private blinkTimer = 0;
  private nextBlinkTime = Math.random() * 3 + 2;
  
  // Talking animation variables
  private mouthOpenness = 0;
  private jawBone?: THREE.Bone;
  private headBone?: THREE.Bone;
  private eyeBones: THREE.Bone[] = [];
  private talkingSpeed = 0;
  private talkingIntensity = 0;

  // Chat functionality
  public isChatOpen = false;
  public userInput = '';
  public messages: Message[] = [];
  public isTyping = false;
  
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
    
    loader.load(
      'assets/3d/avatar.glb',
      (gltf) => {
        this.model = gltf.scene;
        
        // Set up animation mixer if animations exist
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.model);
          gltf.animations.forEach((clip) => {
            const action = this.mixer!.clipAction(clip);
            this.animations.push(action);
          });
        }
        
        // Center the model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);
        
        // Scale the model to 65% by default
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.275 / maxDim; // 65% of the original 3.5 scale
        this.model.scale.setScalar(scale);
        
        // Enable shadows and find bones for animation
        this.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          
          // Look for bones that we can animate for talking
          if (child instanceof THREE.Bone) {
            const boneName = child.name.toLowerCase();
            
            // Look for jaw/mouth bones
            if (boneName.includes('jaw') || boneName.includes('mouth') || boneName.includes('chin')) {
              this.jawBone = child;
              console.log('Found jaw bone:', child.name);
            }
            
            // Look for head bone
            if (boneName.includes('head') || boneName.includes('neck')) {
              this.headBone = child;
              console.log('Found head bone:', child.name);
            }
            
            // Look for eye bones
            if (boneName.includes('eye')) {
              this.eyeBones.push(child);
              console.log('Found eye bone:', child.name);
            }
          }
        });

        this.scene.add(this.model);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading 3D model:', error);
      }
    );
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Update animation mixer if it exists
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
    
    // Enhanced talking animations
    if (this.model) {
      if (this.isTalking) {
        this.headBob += deltaTime * 6;
        this.talkingSpeed += deltaTime * 12; // Speed for mouth movements
        
        // More realistic head movements
        const headMovementX = Math.sin(this.headBob * 0.8) * 0.03;
        const headMovementY = Math.sin(this.headBob * 0.6) * 0.02;
        const headMovementZ = Math.sin(this.headBob * 0.4) * 0.015;
        
        // Apply head movements
        if (this.headBone) {
          this.headBone.rotation.x = headMovementX;
          this.headBone.rotation.y = headMovementY;
          this.headBone.rotation.z = headMovementZ;
        } else {
          // Fallback to model rotation if no head bone found
          this.model.rotation.x = headMovementX * 0.5;
        }
        
        // Simulate mouth/jaw movement
        this.mouthOpenness = (Math.sin(this.talkingSpeed) + 1) * 0.5; // 0 to 1
        const jawRotation = this.mouthOpenness * 0.15; // Max jaw opening
        
        if (this.jawBone) {
          this.jawBone.rotation.x = jawRotation;
        }
        
        // Subtle body language - shoulders and torso
        const bodyMovement = Math.sin(this.headBob * 0.3) * 0.01;
        this.model.rotation.z = bodyMovement;
        
        // Breathing effect
        const breathingScale = 1 + Math.sin(this.headBob * 0.5) * 0.005;
        this.model.scale.y = this.model.scale.x * breathingScale;
        
      } else {
        // Reset to neutral pose when not talking
        if (this.headBone) {
          this.headBone.rotation.x = THREE.MathUtils.lerp(this.headBone.rotation.x, 0, deltaTime * 2);
          this.headBone.rotation.y = THREE.MathUtils.lerp(this.headBone.rotation.y, 0, deltaTime * 2);
          this.headBone.rotation.z = THREE.MathUtils.lerp(this.headBone.rotation.z, 0, deltaTime * 2);
        }
        
        if (this.jawBone) {
          this.jawBone.rotation.x = THREE.MathUtils.lerp(this.jawBone.rotation.x, 0, deltaTime * 3);
        }
        
        // Reset model rotations
        this.model.rotation.x = THREE.MathUtils.lerp(this.model.rotation.x, 0, deltaTime * 2);
        this.model.rotation.z = THREE.MathUtils.lerp(this.model.rotation.z, 0, deltaTime * 2);
        
        // Reset scale
        const targetScale = 2.275 / Math.max(1, 1, 1); // Original scale calculation (65%)
        this.model.scale.y = THREE.MathUtils.lerp(this.model.scale.y, this.model.scale.x, deltaTime * 2);
      }
      
      // Enhanced blinking
      this.blinkTimer += deltaTime;
      if (this.blinkTimer >= this.nextBlinkTime) {
        this.blink();
        this.blinkTimer = 0;
        this.nextBlinkTime = Math.random() * 4 + 2;
      }
    }
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private blink(): void {
    // Enhanced blink effect for eyes
    if (this.eyeBones.length > 0) {
      this.eyeBones.forEach(eyeBone => {
        const originalScale = eyeBone.scale.y;
        
        // Quick close
        eyeBone.scale.y = 0.1;
        
        // Quick open
        setTimeout(() => {
          if (eyeBone) {
            eyeBone.scale.y = originalScale;
          }
        }, 120);
      });
    } else {
      // Fallback blink using model scale
      const originalScale = this.model.scale.clone();
      this.model.scale.y *= 0.98;
      
      setTimeout(() => {
        if (this.model) {
          this.model.scale.copy(originalScale);
        }
      }, 100);
    }
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
    this.isTalking = true; // Start talking animation when AI is thinking
    
    try {
      const response = await this.http.post<any>(environment.aiApiUrl, {
        prompt: userMessage,
        context: this.CONTEXT
      }).toPromise();
      
      // Simulate typing delay
      await this.delay(800);
      
      let aiResponse = 'Sorry, I couldn\'t process that. Please try again!';
      
      if (response?.data?.choices?.[0]?.message?.content) {
        aiResponse = response.data.choices[0].message.content;
      } else if (response?.response) {
        aiResponse = response.response;
      } else if (response?.message) {
        aiResponse = response.message;
      }
      
      this.addMessage(aiResponse, false);
      
      // Stop the temporary talking animation since TTS will control it now
      this.isTalking = false;
      
    } catch (error) {
      console.error('AI API Error:', error);
      this.addMessage('Oops! Something went wrong. Please try again later. 😅', false);
      this.isTalking = false;
    } finally {
      this.isTyping = false;
    }
  }

  private addMessage(text: string, isUser: boolean): void {
    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    this.messages.push({ text, isUser, time });
    
    // Scroll to bottom after a short delay
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private scrollToBottom(): void {
    if (this.chatMessages) {
      const element = this.chatMessages.nativeElement;
      element.scrollTop = element.scrollHeight;
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
