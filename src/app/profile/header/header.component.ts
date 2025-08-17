import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMenuOpen = false;
  isPlaying = false;
  audioElement: HTMLAudioElement | null = null;

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
    } else {
      // Restore scroll position and normal behavior
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      
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
    
    // Restore scroll position
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
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
      await this.audioElement.play();
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  pauseMusic() {
    if (!this.audioElement) return;
    
    this.audioElement.pause();
    this.isPlaying = false;
  }

  cleanup() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
  }
}
