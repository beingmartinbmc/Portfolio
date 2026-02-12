import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {NgClass} from '@angular/common';

interface Skill {
  name: string;
  proficiency: number;
  x: number;
  y: number;
  details?: SkillDetail;
}

interface SkillDetail {
  description: string;
  experience: string[];
  projects: string[];
  achievements: string[];
  relatedSkills: string[];
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
  showDetailModal: boolean = false;
  rocketAnimating: boolean = false;
  rocketPosition: { x: number; y: number } | null = null;
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
    this.addSkillDetails();
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
          { name: 'Spring Boot', proficiency: 90, x: 6, y: 48 },
          { name: 'Echo', proficiency: 85, x: 18, y: 54 },
          { name: 'Dropwizard', proficiency: 88, x: 30, y: 50 },
          { name: 'Google Guice', proficiency: 85, x: 12, y: 62 },
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
    if (this.selectedSkill === skill && this.showDetailModal) {
      this.closeDetailModal();
      return;
    }

    this.selectedSkill = skill;
    this.selectedConstellation = constellation;
    this.rocketAnimating = true;
    this.rocketPosition = { x: 50, y: 95 }; // Start from bottom center

    // Animate rocket to star position
    setTimeout(() => {
      this.rocketPosition = { x: skill.x, y: skill.y };
    }, 100);

    // Show modal after rocket arrives
    setTimeout(() => {
      this.showDetailModal = true;
      this.rocketAnimating = false;
    }, 1500);
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedSkill = null;
    this.selectedConstellation = null;
    this.rocketPosition = null;
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

  private addSkillDetails(): void {
    const skillDetails: Record<string, SkillDetail> = {
      'MySQL': {
        description: 'Extensive experience with MySQL across multiple versions in production environments.',
        experience: [
          'Worked on MySQL 5.6, MySQL 5.7 and MySQL 8',
          'Migrated systems from old DB to new DB using Amazon DMS',
          'Experience in tuning queries making them use to force index'
        ],
        projects: [
          'Database migration for Games24x7 gaming platform',
          'Query optimization for high-traffic applications',
          'Schema design for microservices architecture'
        ],
        achievements: [
          'Reduced query latency by 60% through optimization',
          'Successfully migrated 5+ production databases with zero downtime',
          'Implemented database monitoring and alerting'
        ],
        relatedSkills: ['MongoDB', 'Redis', 'Elasti-Cache']
      },
      'Java 21': {
        description: 'Proficient in modern Java features including virtual threads, pattern matching, and record patterns.',
        experience: [
          'Extensive experience with Java 8-21 features',
          'Implemented concurrent programming with virtual threads',
          'Used pattern matching for type-safe code'
        ],
        projects: [
          'High-performance microservices with Java 21',
          'Concurrent data processing pipelines',
          'RESTful APIs with modern Java features'
        ],
        achievements: [
          'Adopted Java 21 virtual threads for 3x throughput improvement',
          'Reduced code complexity by 40% with pattern matching',
          'Migrated legacy codebase to modern Java features'
        ],
        relatedSkills: ['Spring Boot', 'Microservices', 'DSA']
      },
      'Kafka': {
        description: 'Expert in Apache Kafka for building real-time data pipelines and event-driven architectures.',
        experience: [
          'Designed and implemented Kafka clusters',
          'Built event-driven microservices',
          'Optimized Kafka performance for high throughput'
        ],
        projects: [
          'Real-time analytics pipeline for gaming platform',
          'Event sourcing architecture for financial systems',
          'Kafka-based messaging for microservices'
        ],
        achievements: [
          'Processed 1M+ events per second with Kafka',
          'Built fault-tolerant event streaming architecture',
          'Reduced data processing latency by 80%'
        ],
        relatedSkills: ['RabbitMQ', 'AmazonSQS', 'Microservices']
      },
      'Spring Boot': {
        description: 'Deep expertise in Spring Boot for building production-ready microservices and REST APIs.',
        experience: [
          'Built 10+ production microservices with Spring Boot',
          'Implemented Spring Security for authentication',
          'Used Spring Data for database operations'
        ],
        projects: [
          'Gaming platform backend services',
          'Financial transaction processing system',
          'User management and authentication service'
        ],
        achievements: [
          'Reduced development time by 50% with Spring Boot',
          'Achieved 99.9% uptime in production',
          'Implemented comprehensive monitoring and logging'
        ],
        relatedSkills: ['Java 21', 'Microservices', 'MySQL']
      },
      'Microservices': {
        description: 'Architected and implemented scalable microservices architectures with proper separation of concerns.',
        experience: [
          'Designed microservices from monolithic applications',
          'Implemented service mesh patterns',
          'Built inter-service communication with REST/gRPC'
        ],
        projects: [
          'Gaming platform microservices architecture',
          'Financial services distributed system',
          'E-commerce order processing system'
        ],
        achievements: [
          'Scaled system to handle 10M+ concurrent users',
          'Reduced deployment time by 75% with microservices',
          'Implemented circuit breaker patterns for resilience'
        ],
        relatedSkills: ['Spring Boot', 'Kafka', 'Docker']
      },
      'LLM': {
        description: 'Working with Large Language Models for building AI-powered applications and services.',
        experience: [
          'Integrated OpenAI and Claude APIs',
          'Built RAG systems for domain-specific knowledge',
          'Implemented prompt engineering best practices'
        ],
        projects: [
          'AI-powered customer support chatbot',
          'Document analysis and summarization system',
          'Code generation and review assistant'
        ],
        achievements: [
          'Reduced customer support response time by 60%',
          'Built RAG system with 95% accuracy',
          'Automated 40% of code review process'
        ],
        relatedSkills: ['Generative AI', 'RAG', 'VectorDB']
      },
      'Redis': {
        description: 'Expert in Redis for caching, session management, and real-time data structures.',
        experience: [
          'Designed Redis caching strategies',
          'Implemented session management with Redis',
          'Used Redis for real-time leaderboards and analytics'
        ],
        projects: [
          'Real-time gaming leaderboards',
          'Session management for microservices',
          'Cache layer for high-traffic APIs'
        ],
        achievements: [
          'Reduced database load by 70% with Redis caching',
          'Built real-time analytics with Redis streams',
          'Implemented distributed caching with Redis Cluster'
        ],
        relatedSkills: ['Elasti-Cache', 'MySQL', 'Kafka']
      }
    };

    // Attach details to skills
    this.constellations.forEach(constellation => {
      constellation.skills.forEach(skill => {
        if (skillDetails[skill.name]) {
          skill.details = skillDetails[skill.name];
        }
      });
    });
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
