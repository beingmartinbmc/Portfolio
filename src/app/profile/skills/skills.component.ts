import {Component, OnInit, HostListener} from '@angular/core';
import {SKILL_DETAILS, SkillDetail} from './skills.data';
import {NgClass} from '@angular/common';

interface Skill {
  name: string;
  proficiency: number;
  level: 'primary' | 'secondary' | 'supporting';
  tooltip: string;
  x: number;
  y: number;
  details?: SkillDetail;
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
export class SkillsComponent implements OnInit {

  constellations: Constellation[] = [];
  constellationLines: ConstellationLine[] = [];
  crossClusterLines: ConstellationLine[] = [];

  selectedSkill: Skill | null = null;
  selectedConstellation: Constellation | null = null;
  showDetailModal = false;

  hoveredSkill: Skill | null = null;
  hoveredConstellation: Constellation | null = null;
  tooltipPos: { x: number; y: number } | null = null;

  // Focus mode: spotlights primary stars on page load
  focusModeActive = true;

  rocketAnimating = false;
  rocketPosition: { x: number; y: number } | null = null;
  zooming = false;
  zoomTarget: { x: number; y: number } | null = null;
  rocketTrail: { x: number; y: number; opacity: number; size: number }[] = [];

  readonly ringRadius = 4.5;
  readonly ringStroke = 0.55;

  backgroundStars: { x: number; y: number; size: number; delay: number }[] = [];

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showDetailModal) this.closeDetailModal();
  }

  ngOnInit(): void {
    this.buildConstellations();
    this.buildConnections();
    this.generateBackgroundStars();
    this.addSkillDetails();
    // Auto-deactivate focus mode after 4s
    setTimeout(() => { this.focusModeActive = false; }, 4000);
  }

  private buildConstellations(): void {
    this.constellations = [
      {
        id: 'languages', name: 'Languages', color: '#64B5F6', glowColor: 'rgba(100,181,246,0.6)',
        skills: [
          { name: 'Java',   proficiency: 90, level: 'primary',    tooltip: 'Java 8–21 · Virtual threads · Production backends', x: 12, y: 14 },
          { name: 'Python', proficiency: 88, level: 'secondary',   tooltip: 'FastAPI · Flask · Data processing · AI tooling',     x: 24, y: 10 },
          { name: 'GO',     proficiency: 93, level: 'primary',    tooltip: 'Goroutines · gRPC · High-throughput services',        x: 8,  y: 28 },
          { name: 'NodeJS', proficiency: 91, level: 'secondary',   tooltip: 'Express · NestJS · WebSockets · Lambda',             x: 22, y: 26 },
        ]
      },
      {
        id: 'architecture', name: 'Architecture', color: '#CE93D8', glowColor: 'rgba(206,147,216,0.6)',
        skills: [
          { name: 'High Level Design', proficiency: 95, level: 'primary',    tooltip: 'Scalability · Availability · System trade-offs',   x: 48, y: 8  },
          { name: 'Low Level Design',  proficiency: 90, level: 'secondary',   tooltip: 'SOLID · Design patterns · Clean APIs',              x: 38, y: 24 },
          { name: 'Microservices',     proficiency: 95, level: 'primary',    tooltip: 'Service decomposition · Resilience · Event-driven',  x: 58, y: 24 },
        ]
      },
      {
        id: 'databases', name: 'Databases', color: '#80CBC4', glowColor: 'rgba(128,203,196,0.6)',
        skills: [
          { name: 'MySQL',         proficiency: 95, level: 'primary',    tooltip: 'MySQL 5.6–8 · Query tuning · Amazon DMS',      x: 78, y: 10 },
          { name: 'MongoDB',       proficiency: 90, level: 'secondary',   tooltip: 'Document storage · Aggregations · Sharding',   x: 90, y: 16 },
          { name: 'Neptune',       proficiency: 88, level: 'supporting',  tooltip: 'Amazon graph DB · Gremlin traversals',          x: 74, y: 22 },
          { name: 'Salesforce DB', proficiency: 85, level: 'supporting',  tooltip: 'SOQL · Custom objects · CRM integration',       x: 88, y: 28 },
          { name: 'Cassandra',     proficiency: 88, level: 'supporting',  tooltip: 'Write-heavy · Time-series · High availability', x: 80, y: 34 },
        ]
      },
      {
        id: 'frameworks', name: 'Frameworks', color: '#FFB74D', glowColor: 'rgba(255,183,77,0.6)',
        skills: [
          { name: 'Spring Boot',  proficiency: 90, level: 'secondary',   tooltip: 'REST APIs · Spring Security · Actuator', x: 6,  y: 48 },
          { name: 'Echo',         proficiency: 85, level: 'secondary',   tooltip: 'Go web framework · Low-latency APIs',     x: 18, y: 54 },
          { name: 'Dropwizard',   proficiency: 88, level: 'supporting',  tooltip: 'Ops-friendly Java · Jersey · Metrics',    x: 30, y: 50 },
          { name: 'Google Guice', proficiency: 85, level: 'supporting',  tooltip: 'Dependency injection · Non-Spring Java',  x: 12, y: 62 },
        ]
      },
      {
        id: 'ai', name: 'AI / ML', color: '#F48FB1', glowColor: 'rgba(244,143,177,0.6)',
        skills: [
          { name: 'Generative AI', proficiency: 90, level: 'primary',    tooltip: 'GPT-4 · Claude · Multimodal · Prompt engineering', x: 40, y: 46 },
          { name: 'LLM',           proficiency: 90, level: 'primary',    tooltip: 'OpenAI · Claude · Structured outputs · AI apps',    x: 54, y: 42 },
          { name: 'RAG',           proficiency: 88, level: 'secondary',   tooltip: 'Retrieval-augmented generation · Hybrid search',   x: 44, y: 58 },
          { name: 'VectorDB',      proficiency: 85, level: 'secondary',   tooltip: 'Pinecone · Weaviate · pgvector · Embeddings',       x: 58, y: 56 },
        ]
      },
      {
        id: 'queues', name: 'Queues', color: '#81C784', glowColor: 'rgba(129,199,132,0.6)',
        skills: [
          { name: 'Kafka',     proficiency: 99, level: 'primary',    tooltip: 'Event streaming · 1M+ events/sec · Event-driven', x: 76, y: 48 },
          { name: 'RabbitMQ',  proficiency: 90, level: 'secondary',   tooltip: 'Task queues · Dead-letter · Message reliability', x: 88, y: 54 },
          { name: 'AmazonSQS', proficiency: 88, level: 'supporting',  tooltip: 'Managed queuing · Serverless · Fan-out patterns', x: 80, y: 64 },
        ]
      },
      {
        id: 'core', name: 'Core CS', color: '#FFD54F', glowColor: 'rgba(255,213,79,0.6)',
        skills: [
          { name: 'DSA',        proficiency: 95, level: 'secondary',   tooltip: 'Algorithms · Data structures · Problem solving', x: 16, y: 72 },
          { name: 'Networking', proficiency: 95, level: 'supporting',  tooltip: 'TCP/IP · HTTP/2 · gRPC · WebSockets',             x: 30, y: 80 },
        ]
      },
      {
        id: 'cache', name: 'Cache', color: '#E57373', glowColor: 'rgba(229,115,115,0.6)',
        skills: [
          { name: 'Elasti-Cache', proficiency: 88, level: 'supporting',  tooltip: 'Managed Redis/Memcached on AWS',                  x: 74, y: 76 },
          { name: 'Redis',        proficiency: 90, level: 'secondary',   tooltip: 'Caching · Sorted sets · Streams · Rate limiting', x: 88, y: 74 },
        ]
      }
    ];
  }

  private buildConnections(): void {
    this.constellationLines = [];
    for (const c of this.constellations) {
      const s = c.skills;
      for (let i = 0; i < s.length - 1; i++) {
        this.constellationLines.push({ x1: s[i].x, y1: s[i].y, x2: s[i+1].x, y2: s[i+1].y, color: c.color });
      }
      if (s.length >= 3) {
        this.constellationLines.push({ x1: s[s.length-1].x, y1: s[s.length-1].y, x2: s[0].x, y2: s[0].y, color: c.color });
      }
    }

    // Cross-domain semantic connections — tell the story of how skills relate
    this.crossClusterLines = [
      { x1: 12, y1: 14, x2: 6,  y2: 48, color: 'rgba(100,181,246,0.5)'  }, // Java → Spring Boot
      { x1: 8,  y1: 28, x2: 18, y2: 54, color: 'rgba(100,181,246,0.5)'  }, // GO → Echo
      { x1: 76, y1: 48, x2: 58, y2: 24, color: 'rgba(129,199,132,0.55)' }, // Kafka → Microservices
      { x1: 6,  y1: 48, x2: 78, y2: 10, color: 'rgba(255,183,77,0.4)'   }, // Spring Boot → MySQL
      { x1: 88, y1: 74, x2: 78, y2: 10, color: 'rgba(229,115,115,0.4)'  }, // Redis → MySQL
      { x1: 54, y1: 42, x2: 76, y2: 48, color: 'rgba(244,143,177,0.45)' }, // LLM → Kafka
    ];
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

  private addSkillDetails(): void {
    this.constellations.forEach(c => {
      c.skills.forEach(skill => {
        if (SKILL_DETAILS[skill.name]) skill.details = SKILL_DETAILS[skill.name];
      });
    });
  }

  // ── Star sizing by level ──────────────────────────────────

  getLevelStarRadius(level: 'primary' | 'secondary' | 'supporting'): number {
    if (level === 'primary')   return 2.2;
    if (level === 'secondary') return 1.55;
    return 0.95;
  }

  getLevelGlowRadius(level: 'primary' | 'secondary' | 'supporting'): number {
    if (level === 'primary')   return 4.5;
    if (level === 'secondary') return 3.1;
    return 2.1;
  }

  getLabelOffset(level: 'primary' | 'secondary' | 'supporting'): number {
    if (level === 'primary')   return 4.0;
    if (level === 'secondary') return 3.3;
    return 2.7;
  }

  getLevelLabel(level: 'primary' | 'secondary' | 'supporting'): string {
    if (level === 'primary')   return 'Core';
    if (level === 'secondary') return 'Strong';
    return 'Familiar';
  }

  // ── Class helpers ─────────────────────────────────────────

  getStarClasses(skill: Skill, j: number): Record<string, boolean> {
    return {
      'star-group': true,
      [`star-float-${(j % 4) + 1}`]: true,
      'star-group--primary':    skill.level === 'primary',
      'star-group--secondary':  skill.level === 'secondary',
      'star-group--supporting': skill.level === 'supporting',
      'star-group--active':     this.isSelected(skill),
      'star-group--dimmed':     this.isSkillDimmed(skill),
      'star-group--faded':      this.isSkillFaded(skill),
    };
  }

  // ── State checks ──────────────────────────────────────────

  isSelected(skill: Skill): boolean {
    return this.selectedSkill === skill;
  }

  isSkillDimmed(skill: Skill): boolean {
    if (!this.selectedSkill || this.isSelected(skill)) return false;
    if (this.selectedConstellation?.skills.includes(skill)) return false;
    if (this.selectedSkill.details?.relatedSkills.includes(skill.name)) return false;
    return true;
  }

  isSkillFaded(skill: Skill): boolean {
    if (this.selectedSkill) return false; // selection overrides focus mode
    return this.focusModeActive && skill.level !== 'primary';
  }

  // ── Hover ─────────────────────────────────────────────────

  hoverStar(skill: Skill, constellation: Constellation): void {
    this.focusModeActive = false;
    this.hoveredSkill = skill;
    this.hoveredConstellation = constellation;
    const halfW = 9.5;
    const x = Math.max(halfW + 1, Math.min(99 - halfW, skill.x));
    const r = this.getLevelStarRadius(skill.level);
    const y = skill.y <= 22 ? skill.y + r + 1.5 : skill.y - r - 9;
    this.tooltipPos = { x, y };
  }

  unhoverStar(): void {
    this.hoveredSkill = null;
    this.hoveredConstellation = null;
    this.tooltipPos = null;
  }

  // ── Selection ─────────────────────────────────────────────

  selectStar(skill: Skill, constellation: Constellation): void {
    this.focusModeActive = false;
    this.unhoverStar();

    if (this.selectedSkill === skill && this.showDetailModal) {
      this.closeDetailModal();
      return;
    }

    this.showDetailModal = false;
    this.zooming = false;
    this.rocketTrail = [];

    this.selectedSkill = skill;
    this.selectedConstellation = constellation;
    this.rocketAnimating = true;
    this.rocketPosition = { x: 50, y: 98 };

    setTimeout(() => {
      this.rocketPosition = { x: skill.x, y: skill.y };
      this.generateTrailParticles(skill.x, skill.y);
    }, 100);

    setTimeout(() => {
      this.zooming = true;
      this.zoomTarget = { x: skill.x, y: skill.y };
    }, 900);

    setTimeout(() => {
      this.showDetailModal = true;
      this.rocketAnimating = false;
    }, 1800);
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    setTimeout(() => {
      this.zooming = false;
      this.zoomTarget = null;
      this.rocketTrail = [];
    }, 100);
    setTimeout(() => {
      this.selectedSkill = null;
      this.selectedConstellation = null;
      this.rocketPosition = null;
    }, 500);
  }

  getZoomTransform(): string {
    if (!this.zooming || !this.zoomTarget) return 'scale(1)';
    const tx = 50 - this.zoomTarget.x;
    const ty = 50 - this.zoomTarget.y;
    return `scale(1.8) translate(${tx * 0.5}%, ${ty * 0.5}%)`;
  }

  private generateTrailParticles(targetX: number, targetY: number): void {
    this.rocketTrail = [];
    for (let i = 0; i < 12; i++) {
      const t = i / 12;
      this.rocketTrail.push({
        x: 50 + (targetX - 50) * t + (Math.random() - 0.5) * 3,
        y: 98 + (targetY - 98) * t + (Math.random() - 0.5) * 2,
        opacity: 0.3 + (1 - t) * 0.7,
        size: 0.3 + Math.random() * 0.5,
      });
    }
  }

  // ── Category label helpers ────────────────────────────────

  getCategoryLabelX(constellation: Constellation): number {
    return constellation.skills.reduce((sum, s) => sum + s.x, 0) / constellation.skills.length;
  }

  getCategoryLabelY(constellation: Constellation): number {
    return Math.max(...constellation.skills.map(s => s.y)) + 7.5;
  }

  // ── Proficiency ring ──────────────────────────────────────

  getArcPath(cx: number, cy: number, proficiency: number): string {
    const r = this.ringRadius;
    const angle = (proficiency / 100) * 360;
    const rad = (angle - 90) * (Math.PI / 180);
    const largeArc = angle > 180 ? 1 : 0;
    const endX = cx + r * Math.cos(rad);
    const endY = cy + r * Math.sin(rad);
    if (proficiency >= 100) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r}`;
    return `M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
  }

  getPercentY(skill: Skill): number {
    return skill.y < 15 ? skill.y + this.ringRadius + 2.5 : skill.y - this.ringRadius - 1.2;
  }
}
