import { Component, ElementRef, HostListener, AfterViewInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-ai-face',
  standalone: true,
  templateUrl: './ai-face.component.html',
  styleUrls: ['./ai-face.component.scss']
})
export class AiFaceComponent implements AfterViewInit {
  @ViewChild('aiFaceContainer', { static: false }) aiFaceContainer!: ElementRef;

  ngAfterViewInit() {
    // Nothing needed here for now
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
