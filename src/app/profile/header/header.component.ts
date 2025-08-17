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
  }

  closeMenu() {
    this.isMenuOpen = false;
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
