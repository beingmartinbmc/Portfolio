import { Component, ElementRef, HostListener, AfterViewInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-ai-face',
  standalone: true,
  templateUrl: './ai-face.component.html',
  styleUrls: ['./ai-face.component.scss']
})
export class AiFaceComponent implements AfterViewInit {
  @ViewChild('aiFaceContainer', { static: false }) aiFaceContainer!: ElementRef;

  mood: 'happy' | 'wink' | 'surprised' | 'neutral' = 'happy';
  private moodInterval: any;

  ngAfterViewInit() {
    this.startMoodCycle();
  }

  ngOnDestroy() {
    if (this.moodInterval) clearInterval(this.moodInterval);
  }

  startMoodCycle() {
    this.moodInterval = setInterval(() => {
      const moods = ['happy', 'wink', 'surprised', 'neutral'];
      // Avoid repeating the same mood
      let nextMood;
      do {
        nextMood = moods[Math.floor(Math.random() * moods.length)];
      } while (nextMood === this.mood);
      this.mood = nextMood as any;
    }, 2500);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const svg = document.querySelector('.ai-face-container svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Eye centers
    const leftEye = { x: 55, y: 80 };
    const rightEye = { x: 105, y: 80 };
    // Eye movement radius
    const radius = 7;

    // Helper to clamp pupil movement
    function getPupilPos(eye: {x: number, y: number}) {
      const dx = mouseX - eye.x * (rect.width / 160);
      const dy = mouseY - eye.y * (rect.height / 160);
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.sqrt(dx*dx + dy*dy), radius*2);
      return {
        x: eye.x + Math.cos(angle) * Math.min(dist, radius),
        y: eye.y + Math.sin(angle) * Math.min(dist, radius)
      };
    }

    // Only move pupils if not winking or surprised
    if (this.mood !== 'wink' && this.mood !== 'surprised') {
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

  reactToClick() {
    // On click, force a wink mood for a short time
    this.mood = 'wink';
    setTimeout(() => {
      this.mood = 'happy';
    }, 900);
  }
}
