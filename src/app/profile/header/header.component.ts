import {Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('audioCanvas', { static: true }) audioCanvas!: ElementRef<HTMLCanvasElement>;
  
  isScrolled = false;
  isMenuOpen = false;
  isPlaying = false;
  audioElement: HTMLAudioElement | null = null;
  
  // Audio Visualizer properties
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private animationId: number | null = null;
  private dataArray: Uint8Array | null = null;

  constructor() {
  }

  ngOnInit(): void {
    this.initializeAudio();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 100;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Prevent body scrolling when menu is open
    if (this.isMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Prevent touch scrolling
      document.body.style.touchAction = 'none';
      
      // Add class to body for additional styling
      document.body.classList.add('menu-open');
    } else {
      // Restore scroll position and normal behavior
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      
      // Remove class from body
      document.body.classList.remove('menu-open');
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.touchAction = '';
    
    // Remove class from body
    document.body.classList.remove('menu-open');
    
    // Restore scroll position
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  onNavLinkClick() {
    // Close mobile menu when a navigation link is clicked
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  initializeAudio() {
    this.audioElement = new Audio();
    // Using local audio file from assets/audio directory
    this.audioElement.src = 'assets/audio/beethoven.mp3';
    this.audioElement.loop = true;
    this.audioElement.volume = 0.3;
    
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
    });
    
    // Initialize audio visualizer
    this.initializeAudioVisualizer();
  }

  initializeAudioVisualizer() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      // Connect audio element to analyser
      if (this.audioElement) {
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }
    } catch (error) {
      console.warn('Audio visualizer not supported:', error);
    }
  }

  toggleMusic() {
    if (!this.audioElement) return;
    
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      this.playMusic();
    }
  }

  async playMusic() {
    if (!this.audioElement) return;
    
    try {
      // Resume audio context if suspended
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      await this.audioElement.play();
      this.isPlaying = true;
      this.startVisualizer();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  pauseMusic() {
    if (!this.audioElement) return;
    
    this.audioElement.pause();
    this.isPlaying = false;
    this.stopVisualizer();
  }

  startVisualizer() {
    if (!this.analyser || !this.dataArray || !this.audioCanvas) return;
    
    const canvas = this.audioCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const draw = () => {
      if (!this.isPlaying || !this.analyser || !this.dataArray) {
        this.stopVisualizer();
        return;
      }
      
      this.animationId = requestAnimationFrame(draw);
      
      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw bars
      const barWidth = (canvas.width / this.dataArray.length) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < this.dataArray.length; i++) {
        barHeight = (this.dataArray[i] / 255) * canvas.height;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  }

  stopVisualizer() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Clear canvas
    if (this.audioCanvas) {
      const canvas = this.audioCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  cleanup() {
    this.stopVisualizer();
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
