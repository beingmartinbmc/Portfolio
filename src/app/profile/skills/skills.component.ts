import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {NgClass} from '@angular/common';

interface Skill {
  name: string;
  proficiency: number;
  x: number;
  y: number;
}

interface Constellation {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  skills: Skill[];
}

interface ConstellationLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class SkillsComponent implements OnInit, AfterViewInit {

  constellations: Constellation[] = [];
  constellationLines: ConstellationLine[] = [];
  selectedSkill: Skill | null = null;
  selectedConstellation: Constellation | null = null;
  canvasWidth = 1200;
  canvasHeight = 700;

  // Radial ring config (in SVG viewBox units)
  ringRadius = 4.5;
  ringStroke = 0.55;

  // Background stars for ambiance
  backgroundStars: { x: number; y: number; size: number; delay: number }[] = [];

  constructor() {}

  ngOnInit(): void {
    this.buildConstellations();
    this.buildConnections();
    this.generateBackgroundStars();
  }

  ngAfterViewInit(): void {}

  private buildConstellations(): void {
    this.constellations = [
      {
        id: 'languages',
        name: 'Languages',
        color: '#64B5F6',
        glowColor: 'rgba(100, 181, 246, 0.6)',
        skills: [
          { name: 'Java 21', proficiency: 90, x: 12, y: 14 },
          { name: 'Python', proficiency: 88, x: 24, y: 10 },
          { name: 'GO', proficiency: 93, x: 8, y: 28 },
          { name: 'NodeJS', proficiency: 91, x: 22, y: 26 },
        ]
      },
      {
        id: 'architecture',
        name: 'Architecture',
        color: '#CE93D8',
        glowColor: 'rgba(206, 147, 216, 0.6)',
        skills: [
          { name: 'High Level Design', proficiency: 95, x: 48, y: 8 },
          { name: 'Low Level Design', proficiency: 90, x: 38, y: 24 },
          { name: 'Microservices', proficiency: 95, x: 58, y: 24 },
        ]
      },
      {
        id: 'databases',
        name: 'Databases',
        color: '#80CBC4',
        glowColor: 'rgba(128, 203, 196, 0.6)',
        skills: [
          { name: 'MySQL', proficiency: 95, x: 78, y: 10 },
          { name: 'MongoDB', proficiency: 90, x: 90, y: 16 },
          { name: 'Neptune', proficiency: 88, x: 74, y: 22 },
          { name: 'Salesforce DB', proficiency: 85, x: 88, y: 28 },
          { name: 'Cassandra', proficiency: 88, x: 80, y: 34 },
        ]
      },
      {
        id: 'frameworks',
        name: 'Frameworks',
        color: '#FFB74D',
        glowColor: 'rgba(255, 183, 77, 0.6)',
        skills: [
          { name: 'Spring Boot', proficiency: 90, x: 8, y: 48 },
          { name: 'Echo', proficiency: 85, x: 20, y: 54 },
        ]
      },
      {
        id: 'ai',
        name: 'AI / ML',
        color: '#F48FB1',
        glowColor: 'rgba(244, 143, 177, 0.6)',
        skills: [
          { name: 'Generative AI', proficiency: 90, x: 40, y: 46 },
          { name: 'LLM', proficiency: 90, x: 54, y: 42 },
          { name: 'RAG', proficiency: 88, x: 44, y: 58 },
          { name: 'VectorDB', proficiency: 85, x: 58, y: 56 },
        ]
      },
      {
        id: 'queues',
        name: 'Queues',
        color: '#81C784',
        glowColor: 'rgba(129, 199, 132, 0.6)',
        skills: [
          { name: 'Kafka', proficiency: 99, x: 76, y: 48 },
          { name: 'RabbitMQ', proficiency: 90, x: 88, y: 54 },
          { name: 'AmazonSQS', proficiency: 88, x: 80, y: 64 },
        ]
      },
      {
        id: 'core',
        name: 'Core CS',
        color: '#FFD54F',
        glowColor: 'rgba(255, 213, 79, 0.6)',
        skills: [
          { name: 'DSA', proficiency: 95, x: 16, y: 72 },
          { name: 'Networking', proficiency: 95, x: 30, y: 80 },
        ]
      },
      {
        id: 'cache',
        name: 'Cache',
        color: '#E57373',
        glowColor: 'rgba(229, 115, 115, 0.6)',
        skills: [
          { name: 'Elasti-Cache', proficiency: 88, x: 74, y: 76 },
          { name: 'Redis', proficiency: 90, x: 88, y: 74 },
        ]
      }
    ];
  }

  private buildConnections(): void {
    this.constellationLines = [];
    for (const constellation of this.constellations) {
      const skills = constellation.skills;
      // Connect skills within a constellation sequentially
      for (let i = 0; i < skills.length - 1; i++) {
        this.constellationLines.push({
          x1: skills[i].x,
          y1: skills[i].y,
          x2: skills[i + 1].x,
          y2: skills[i + 1].y,
          color: constellation.color
        });
      }
      // Close the loop for constellations with 3+ skills
      if (skills.length >= 3) {
        this.constellationLines.push({
          x1: skills[skills.length - 1].x,
          y1: skills[skills.length - 1].y,
          x2: skills[0].x,
          y2: skills[0].y,
          color: constellation.color
        });
      }
    }

    // Cross-constellation faint connections for visual cohesion
    this.constellationLines.push(
      { x1: 20, y1: 24, x2: 38, y2: 24, color: 'rgba(255,255,255,0.05)' }, // NodeJS -> LLD
      { x1: 58, y1: 24, x2: 76, y2: 18, color: 'rgba(255,255,255,0.05)' }, // Microservices -> Neptune
      { x1: 58, y1: 56, x2: 78, y2: 48, color: 'rgba(255,255,255,0.05)' }, // VectorDB -> Kafka
      { x1: 20, y1: 54, x2: 40, y2: 46, color: 'rgba(255,255,255,0.05)' }, // Echo -> GenAI
      { x1: 44, y1: 58, x2: 28, y2: 82, color: 'rgba(255,255,255,0.05)' }, // RAG -> Networking
      { x1: 82, y1: 62, x2: 76, y2: 78, color: 'rgba(255,255,255,0.05)' }, // AmazonSQS -> Elasti-Cache
    );
  }

  private generateBackgroundStars(): void {
    this.backgroundStars = [];
    for (let i = 0; i < 80; i++) {
      this.backgroundStars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 5
      });
    }
  }

  getStarSize(proficiency: number): number {
    return 6 + (proficiency / 100) * 10;
  }

  getStarGlow(proficiency: number): number {
    return 8 + (proficiency / 100) * 20;
  }

  selectStar(skill: Skill, constellation: Constellation): void {
    if (this.selectedSkill === skill) {
      this.selectedSkill = null;
      this.selectedConstellation = null;
    } else {
      this.selectedSkill = skill;
      this.selectedConstellation = constellation;
    }
  }

  isSelected(skill: Skill): boolean {
    return this.selectedSkill === skill;
  }

  getCategoryLabelX(constellation: Constellation): number {
    const avgX = constellation.skills.reduce((sum, s) => sum + s.x, 0) / constellation.skills.length;
    return avgX;
  }

  getCategoryLabelY(constellation: Constellation): number {
    const maxY = Math.max(...constellation.skills.map(s => s.y));
    return maxY + 6;
  }

  /** SVG arc path for the proficiency ring (0-100%) */
  getArcPath(cx: number, cy: number, proficiency: number): string {
    const r = this.ringRadius;
    const angle = (proficiency / 100) * 360;
    const rad = (angle - 90) * (Math.PI / 180);
    const largeArc = angle > 180 ? 1 : 0;
    const endX = cx + r * Math.cos(rad);
    const endY = cy + r * Math.sin(rad);
    const startX = cx;
    const startY = cy - r;

    if (proficiency >= 100) {
      return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`;
    }
    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
  }

  /** Position percentage text below if star is near top, else above */
  getPercentY(skill: Skill): number {
    if (skill.y < 15) {
      return skill.y + this.ringRadius + 2.5;
    }
    return skill.y - this.ringRadius - 1.2;
  }
}
