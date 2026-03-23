import {Component, OnInit, HostListener} from '@angular/core';
import {SKILL_DETAILS, SkillDetail} from './skills.data';
import {NgClass} from '@angular/common';

type SkillLevel = 'primary' | 'secondary' | 'supporting';

interface Skill {
  name: string;
  proficiency: number;
  level: SkillLevel;
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
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
}

type LinkStrength = 'strong' | 'weak';

interface CrossLink {
  from: string;
  to: string;
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  strength: LinkStrength;
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
  crossClusterLines: CrossLink[] = [];

  selectedSkill: Skill | null = null;
  selectedConstellation: Constellation | null = null;
  showDetailModal = false;

  hoveredSkill: Skill | null = null;
  hoveredConstellation: Constellation | null = null;
  tooltipPos: { x: number; y: number } | null = null;
  tooltipWidth = 32;

  focusModeActive = true;
  narrativeActive = false;
  narrativeHighlightedSkills = new Set<string>();
  narrativeHighlightedLinks: Set<string> = new Set();

  rocketAnimating = false;
  rocketPosition: { x: number; y: number } | null = null;
  zooming = false;
  zoomTarget: { x: number; y: number } | null = null;
  rocketTrail: { x: number; y: number; opacity: number; size: number }[] = [];

  systemMode = false;
  readonly systemModeLabels: Record<string, string> = {
    'Kafka': 'Event Bus',
    'Redis': 'Cache Layer',
    'MySQL': 'Primary DB',
    'MongoDB': 'Document Store',
    'Microservices': 'Service Mesh',
    'Spring Boot': 'API Framework',
    'High Level Design': 'System Design',
    'LLM': 'AI Engine',
    'RAG': 'Knowledge Retrieval',
    'VectorDB': 'Embedding Store',
    'Elasti-Cache': 'Cache Cluster',
    'RabbitMQ': 'Task Queue',
    'AmazonSQS': 'Managed Queue',
    'Neptune': 'Graph Store',
    'Cassandra': 'Time-Series DB',
  };

  readonly systemModeFlow = [
    'Spring Boot', 'Microservices', 'Kafka', 'Redis', 'MySQL'
  ];

  readonly ringRadius = 4.5;
  readonly ringStroke = 0.55;

  backgroundStars: { x: number; y: number; size: number; delay: number }[] = [];

  // Precomputed lookup: skill name → Skill
  private skillMap = new Map<string, Skill>();

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showDetailModal) this.closeDetailModal();
  }

  ngOnInit(): void {
    this.buildConstellations();
    this.buildConnections();
    this.generateBackgroundStars();
    this.addSkillDetails();
    this.buildSkillMap();
    this.runNarrativeIntro();
    setTimeout(() => { this.focusModeActive = false; }, 4000);
  }

  private buildSkillMap(): void {
    this.constellations.forEach(c => c.skills.forEach(s => this.skillMap.set(s.name, s)));
  }

  // ── Constellation data ──────────────────────────────────

  private buildConstellations(): void {
    this.constellations = [
      {
        id: 'languages', name: 'Languages', color: '#64B5F6', glowColor: 'rgba(100,181,246,0.6)',
        skills: [
          { name: 'Java',   proficiency: 90, level: 'primary',    tooltip: 'Microservices · virtual threads (8–21)',  x: 12, y: 14 },
          { name: 'Python', proficiency: 88, level: 'secondary',  tooltip: 'AI pipelines · automation · FastAPI',     x: 24, y: 10 },
          { name: 'GO',     proficiency: 93, level: 'secondary',  tooltip: 'gRPC services · goroutines · CLI',        x: 8,  y: 28 },
          { name: 'NodeJS', proficiency: 91, level: 'secondary',  tooltip: 'WebSockets · Lambda · real-time',         x: 22, y: 26 },
        ]
      },
      {
        id: 'architecture', name: 'Architecture', color: '#CE93D8', glowColor: 'rgba(206,147,216,0.6)',
        skills: [
          { name: 'High Level Design', proficiency: 95, level: 'primary',   tooltip: 'Scaled to millions of events/day',    x: 48, y: 8  },
          { name: 'Low Level Design',  proficiency: 90, level: 'secondary', tooltip: 'SOLID · domain modeling · clean APIs', x: 38, y: 24 },
          { name: 'Microservices',     proficiency: 95, level: 'primary',   tooltip: 'Decomposed monoliths · event-driven', x: 58, y: 24 },
        ]
      },
      {
        id: 'databases', name: 'Databases', color: '#80CBC4', glowColor: 'rgba(128,203,196,0.6)',
        skills: [
          { name: 'MySQL',         proficiency: 95, level: 'primary',    tooltip: 'Query tuning · DMS migrations',        x: 78, y: 10 },
          { name: 'MongoDB',       proficiency: 90, level: 'secondary',  tooltip: 'Aggregation pipelines · sharding',     x: 90, y: 16 },
          { name: 'Neptune',       proficiency: 88, level: 'supporting', tooltip: 'Graph traversals · fraud analysis',    x: 74, y: 22 },
          { name: 'Salesforce DB', proficiency: 85, level: 'supporting', tooltip: 'SOQL reporting · CRM sync',            x: 88, y: 28 },
          { name: 'Cassandra',     proficiency: 88, level: 'supporting', tooltip: 'Time-series · partition design',       x: 80, y: 34 },
        ]
      },
      {
        id: 'frameworks', name: 'Frameworks', color: '#FFB74D', glowColor: 'rgba(255,183,77,0.6)',
        skills: [
          { name: 'Spring Boot',  proficiency: 90, level: 'secondary',  tooltip: 'Production APIs · Spring Security',    x: 6,  y: 48 },
          { name: 'Echo',         proficiency: 85, level: 'secondary',  tooltip: 'Lean Go APIs · sub-ms overhead',       x: 18, y: 54 },
          { name: 'Dropwizard',   proficiency: 88, level: 'supporting', tooltip: 'Metrics-first · predictable latency',  x: 32, y: 50 },
          { name: 'Google Guice', proficiency: 85, level: 'supporting', tooltip: 'Modular DI for non-Spring Java',       x: 12, y: 64 },
        ]
      },
      {
        id: 'ai', name: 'AI / ML', color: '#F48FB1', glowColor: 'rgba(244,143,177,0.6)',
        skills: [
          { name: 'Generative AI', proficiency: 90, level: 'primary',   tooltip: 'Cut manual triage effort by 50%',      x: 38, y: 46 },
          { name: 'LLM',           proficiency: 90, level: 'primary',   tooltip: 'API integration · tool-calling',       x: 54, y: 40 },
          { name: 'RAG',           proficiency: 88, level: 'secondary', tooltip: 'Rerank pipelines · less hallucination', x: 42, y: 60 },
          { name: 'VectorDB',      proficiency: 85, level: 'secondary', tooltip: 'Pinecone · pgvector · semantic search', x: 60, y: 56 },
        ]
      },
      {
        id: 'queues', name: 'Queues', color: '#81C784', glowColor: 'rgba(129,199,132,0.6)',
        skills: [
          { name: 'Kafka',     proficiency: 99, level: 'primary',    tooltip: 'Event pipelines · high throughput',     x: 76, y: 48 },
          { name: 'RabbitMQ',  proficiency: 90, level: 'secondary',  tooltip: 'Task queues · dead-letter retries',     x: 88, y: 54 },
          { name: 'AmazonSQS', proficiency: 88, level: 'supporting', tooltip: 'Serverless fan-out · FIFO queues',     x: 80, y: 64 },
        ]
      },
      {
        id: 'core', name: 'Core CS', color: '#FFD54F', glowColor: 'rgba(255,213,79,0.6)',
        skills: [
          { name: 'DSA',        proficiency: 95, level: 'secondary',  tooltip: '500+ problems · interview mentoring',  x: 16, y: 76 },
          { name: 'Networking', proficiency: 95, level: 'supporting', tooltip: 'TCP/IP · TLS debugging · keep-alives', x: 30, y: 82 },
        ]
      },
      {
        id: 'cache', name: 'Cache', color: '#E57373', glowColor: 'rgba(229,115,115,0.6)',
        skills: [
          { name: 'Elasti-Cache', proficiency: 88, level: 'supporting', tooltip: 'Redis clusters · failover · TTL',     x: 74, y: 76 },
          { name: 'Redis',        proficiency: 90, level: 'secondary',  tooltip: 'Leaderboards · rate limiting · sub-ms', x: 88, y: 74 },
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

    this.crossClusterLines = [
      // ── Strong relationships (primary usage) ──
      { from: 'Java',         to: 'Spring Boot',       x1: 12, y1: 14, x2: 6,  y2: 48, color: 'rgba(100,181,246,0.55)', strength: 'strong' },
      { from: 'GO',           to: 'Echo',              x1: 8,  y1: 28, x2: 18, y2: 54, color: 'rgba(100,181,246,0.55)', strength: 'strong' },
      { from: 'Kafka',        to: 'Microservices',     x1: 76, y1: 48, x2: 58, y2: 24, color: 'rgba(129,199,132,0.6)',  strength: 'strong' },
      { from: 'LLM',          to: 'Microservices',     x1: 54, y1: 40, x2: 58, y2: 24, color: 'rgba(244,143,177,0.55)', strength: 'strong' },
      { from: 'Spring Boot',  to: 'MySQL',             x1: 6,  y1: 48, x2: 78, y2: 10, color: 'rgba(255,183,77,0.45)', strength: 'strong' },
      // ── Weak relationships (supporting) ──
      { from: 'Redis',        to: 'MySQL',             x1: 88, y1: 74, x2: 78, y2: 10, color: 'rgba(229,115,115,0.25)', strength: 'weak' },
      { from: 'LLM',          to: 'Java',              x1: 54, y1: 40, x2: 12, y2: 14, color: 'rgba(244,143,177,0.25)', strength: 'weak' },
      { from: 'RAG',          to: 'Kafka',             x1: 42, y1: 60, x2: 76, y2: 48, color: 'rgba(244,143,177,0.2)',  strength: 'weak' },
      { from: 'VectorDB',     to: 'Python',            x1: 60, y1: 56, x2: 24, y2: 10, color: 'rgba(244,143,177,0.2)',  strength: 'weak' },
      { from: 'DSA',          to: 'High Level Design', x1: 16, y1: 76, x2: 48, y2: 8,  color: 'rgba(255,213,79,0.2)',  strength: 'weak' },
      { from: 'Networking',   to: 'Microservices',     x1: 30, y1: 82, x2: 58, y2: 24, color: 'rgba(255,213,79,0.2)',  strength: 'weak' },
    ];
  }

  private generateBackgroundStars(): void {
    this.backgroundStars = [];
    for (let i = 0; i < 80; i++) {
      this.backgroundStars.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5, delay: Math.random() * 5
      });
    }
  }

  private addSkillDetails(): void {
    this.constellations.forEach(c => {
      c.skills.forEach(s => { if (SKILL_DETAILS[s.name]) s.details = SKILL_DETAILS[s.name]; });
    });
  }

  // ── Intro narrative ────────────────────────────────────────

  private runNarrativeIntro(): void {
    const storyNodes = ['Java', 'Microservices', 'Kafka', 'Redis'];
    const storyLinks = ['Java→Spring Boot', 'Kafka→Microservices', 'LLM→Microservices'];
    this.narrativeActive = true;

    storyNodes.forEach((name, i) => {
      setTimeout(() => {
        this.narrativeHighlightedSkills.add(name);
        if (i < storyLinks.length) this.narrativeHighlightedLinks.add(storyLinks[i]);
      }, 400 + i * 450);
    });

    setTimeout(() => {
      this.narrativeActive = false;
      this.narrativeHighlightedSkills.clear();
      this.narrativeHighlightedLinks.clear();
    }, 3200);
  }

  isNarrativeHighlighted(skill: Skill): boolean {
    return this.narrativeActive && this.narrativeHighlightedSkills.has(skill.name);
  }

  isNarrativeLinkHighlighted(link: CrossLink): boolean {
    return this.narrativeActive && this.narrativeHighlightedLinks.has(`${link.from}→${link.to}`);
  }

  // ── Star sizing by level ────────────────────────────────

  getLevelStarRadius(level: SkillLevel): number {
    return level === 'primary' ? 2.2 : level === 'secondary' ? 1.55 : 0.95;
  }

  getLevelGlowRadius(level: SkillLevel): number {
    return level === 'primary' ? 4.5 : level === 'secondary' ? 3.1 : 2.1;
  }

  getLabelOffset(level: SkillLevel): number {
    return level === 'primary' ? 4.0 : level === 'secondary' ? 3.3 : 2.7;
  }

  getLevelLabel(level: SkillLevel): string {
    return level === 'primary' ? 'Core' : level === 'secondary' ? 'Strong' : 'Familiar';
  }

  // ── Hover-aware related skills ──────────────────────────

  /** Names of skills directly connected to the active (hovered or selected) skill */
  private getRelatedNames(skill: Skill): Set<string> {
    const names = new Set<string>();
    // From skill details
    skill.details?.relatedSkills.forEach(n => names.add(n));
    // From cross-cluster links
    this.crossClusterLines.forEach(l => {
      if (l.from === skill.name) names.add(l.to);
      if (l.to === skill.name) names.add(l.from);
    });
    return names;
  }

  // ── Class helpers ───────────────────────────────────────

  getStarClasses(skill: Skill, j: number): Record<string, boolean> {
    const hoverDim = this.isHoverDimmed(skill);
    const selectDim = this.isSelectDimmed(skill);
    return {
      'star-group': true,
      [`star-float-${(j % 4) + 1}`]: true,
      'star-group--primary':    skill.level === 'primary',
      'star-group--secondary':  skill.level === 'secondary',
      'star-group--supporting': skill.level === 'supporting',
      'star-group--active':     this.isSelected(skill),
      'star-group--hovered':    this.hoveredSkill === skill,
      'star-group--dimmed':     selectDim,
      'star-group--hover-dimmed': hoverDim && !selectDim,
      'star-group--faded':      this.isSkillFaded(skill),
      'star-group--narrative':  this.isNarrativeHighlighted(skill),
      'star-group--system-flow': this.isSystemFlowNode(skill),
    };
  }

  getCrossLinkClasses(link: CrossLink): Record<string, boolean> {
    const active = this.hoveredSkill;
    const base: Record<string, boolean> = {
      'cross-cluster-line': true,
      'cross-cluster-line--strong': link.strength === 'strong',
      'cross-cluster-line--weak': link.strength === 'weak',
      'cross-cluster-line--narrative': this.isNarrativeLinkHighlighted(link),
    };
    if (!active) return base;
    const isRelevant = link.from === active.name || link.to === active.name;
    return {
      ...base,
      'cross-cluster-line--highlighted': isRelevant,
      'cross-cluster-line--dimmed': !isRelevant,
    };
  }

  // ── State checks ────────────────────────────────────────

  isSelected(skill: Skill): boolean {
    return this.selectedSkill === skill;
  }

  /** Dim during click/selection */
  isSelectDimmed(skill: Skill): boolean {
    if (!this.selectedSkill || this.isSelected(skill)) return false;
    if (this.selectedConstellation?.skills.includes(skill)) return false;
    if (this.getRelatedNames(this.selectedSkill).has(skill.name)) return false;
    return true;
  }

  /** Dim during hover (lighter than select dim) */
  isHoverDimmed(skill: Skill): boolean {
    if (this.selectedSkill) return false; // selection overrides hover
    if (!this.hoveredSkill || this.hoveredSkill === skill) return false;
    if (this.hoveredConstellation?.skills.includes(skill)) return false;
    if (this.getRelatedNames(this.hoveredSkill).has(skill.name)) return false;
    return true;
  }

  isSkillFaded(skill: Skill): boolean {
    if (this.selectedSkill || this.hoveredSkill) return false;
    return this.focusModeActive && skill.level !== 'primary';
  }

  // ── Hover ───────────────────────────────────────────────

  hoverStar(skill: Skill, constellation: Constellation): void {
    this.focusModeActive = false;
    this.hoveredSkill = skill;
    this.hoveredConstellation = constellation;

    const proofW  = skill.tooltip.length * 0.78;
    const nameW   = skill.name.length * 1.15;
    const metaW   = (constellation.name.length + this.getLevelLabel(skill.level).length + 3) * 0.82;
    const content  = Math.max(proofW, nameW, metaW);
    this.tooltipWidth = Math.min(Math.max(content + 5, 24), 50);

    const halfW = this.tooltipWidth / 2;
    const x = Math.max(halfW + 1, Math.min(99 - halfW, skill.x));
    const r = this.getLevelStarRadius(skill.level);
    const y = skill.y <= 22 ? skill.y + r + 1.5 : skill.y - r - (this.tooltipWidth > 36 ? 13 : 12);
    this.tooltipPos = { x, y };
  }

  unhoverStar(): void {
    this.hoveredSkill = null;
    this.hoveredConstellation = null;
    this.tooltipPos = null;
  }

  // ── Selection ───────────────────────────────────────────

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
    setTimeout(() => { this.zooming = false; this.zoomTarget = null; this.rocketTrail = []; }, 100);
    setTimeout(() => { this.selectedSkill = null; this.selectedConstellation = null; this.rocketPosition = null; }, 500);
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

  // ── System Architecture Mode ───────────────────────────────

  toggleSystemMode(): void {
    this.systemMode = !this.systemMode;
  }

  getDisplayName(skill: Skill): string {
    if (this.systemMode && this.systemModeLabels[skill.name]) {
      return this.systemModeLabels[skill.name];
    }
    return skill.name;
  }

  isSystemFlowNode(skill: Skill): boolean {
    return this.systemMode && this.systemModeFlow.includes(skill.name);
  }

  getSystemFlowIndex(skill: Skill): number {
    return this.systemModeFlow.indexOf(skill.name);
  }

  // ── Category label helpers ──────────────────────────────

  getCategoryLabelX(c: Constellation): number {
    return c.skills.reduce((sum, s) => sum + s.x, 0) / c.skills.length;
  }

  getCategoryLabelY(c: Constellation): number {
    return Math.max(...c.skills.map(s => s.y)) + 7.5;
  }

  // ── Proficiency ring ────────────────────────────────────

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
