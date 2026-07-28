import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {SKILL_DETAILS, SkillDetail} from './skills.data';
import {NgClass} from '@angular/common';
import {AchievementsService} from '../../services/achievements.service';
import {AudioService} from '../../services/audio.service';

type SkillLevel = 'primary' | 'secondary' | 'supporting';

export interface Skill {
  name: string;
  proficiency: number;
  level: SkillLevel;
  tooltip: string;
  x: number;
  y: number;
  details?: SkillDetail;
}

export interface Constellation {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  skills: Skill[];
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class SkillsComponent implements OnInit {

  constellations: Constellation[] = [];

  expandedSkill: Skill | null = null;

  systemMode = false;

  constructor(
    private achievements: AchievementsService,
    private audio: AudioService
  ) {}
  readonly systemModeLabels: Record<string, string> = {
    'Kafka': 'Event Bus',
    'Redis': 'Cache Layer',
    'MySQL': 'Primary DB',
    'MongoDB': 'Document Store',
    'Microservices': 'Service Mesh',
    'Spring Boot': 'API Framework',
    'High Level Design': 'System Design',
    'Generative AI': 'GenAI Core',
    'LLM': 'AI Engine',
    'RAG': 'Knowledge Retrieval',
    'VectorDB': 'Embedding Store',
    'Semantic Caching': 'Semantic Cache',
    'MCP Servers': 'Tool Gateway',
    'Bedrock': 'Model Host',
    'Elasti-Cache': 'Cache Cluster',
    'RabbitMQ': 'Task Queue',
    'AmazonSQS': 'Managed Queue',
    'Neptune': 'Graph Store',
    'Cassandra': 'Time-Series DB',
  };

  readonly systemModeFlow = [
    'Spring Boot', 'Microservices', 'Kafka', 'Redis', 'MySQL'
  ];

  // Ordered top-to-bottom architecture stack used by the graphical "Architecture route" view.
  // Each entry maps a constellation id to a tier icon + a one-line role for the layer.
  private readonly archLayerMeta: { id: string; icon: string; role: string }[] = [
    { id: 'languages',    icon: '\u2699\uFE0F', role: 'Runtime & languages powering every service' },
    { id: 'frameworks',   icon: '\uD83E\uDDE9', role: 'API frameworks that expose the services' },
    { id: 'architecture', icon: '\uD83C\uDFDB\uFE0F', role: 'How services are decomposed & scaled' },
    { id: 'queues',       icon: '\uD83D\uDCE8', role: 'Async backbone moving events between services' },
    { id: 'cache',        icon: '\u26A1', role: 'Hot-path reads & low-latency shared state' },
    { id: 'databases',    icon: '\uD83D\uDDC4\uFE0F', role: 'Source-of-truth & specialised data stores' },
    { id: 'ai',           icon: '\uD83E\uDD16', role: 'Generative AI layer grounded on the platform' },
    { id: 'core',         icon: '\uD83E\uDDE0', role: 'Fundamentals underpinning the whole stack' },
  ];

  architectureLayers: { id: string; name: string; color: string; icon: string; role: string; skills: Skill[] }[] = [];
  totalSkillCount = 0;
  primarySkillCount = 0;
  averageProficiency = 0;

  ngOnInit(): void {
    this.buildConstellations();
    this.addSkillDetails();
    this.computeDerivedStats();
  }

  private computeDerivedStats(): void {
    this.architectureLayers = this.archLayerMeta
      .map(meta => {
        const c = this.constellations.find(x => x.id === meta.id);
        if (!c) return null;
        return { id: c.id, name: c.name, color: c.color, icon: meta.icon, role: meta.role, skills: c.skills };
      })
      .filter((layer): layer is { id: string; name: string; color: string; icon: string; role: string; skills: Skill[] } => layer !== null);

    const all = this.constellations.flatMap(c => c.skills);
    this.totalSkillCount = all.length;
    this.primarySkillCount = all.filter(s => s.level === 'primary').length;
    this.averageProficiency = all.length
      ? Math.round(all.reduce((sum, s) => sum + s.proficiency, 0) / all.length)
      : 0;
  }

  private buildConstellations(): void {
    this.constellations = [
      {
        id: 'languages', name: 'Languages', color: '#64B5F6', glowColor: 'rgba(100,181,246,0.6)',
        skills: [
          { name: 'Java',   proficiency: 90, level: 'primary',    tooltip: 'Microservices · virtual threads (8–21)',  x: 12, y: 14 },
          { name: 'Python', proficiency: 92, level: 'secondary',  tooltip: 'AI pipelines · automation · FastAPI',     x: 24, y: 10 },
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
          { name: 'Neptune',       proficiency: 91, level: 'supporting', tooltip: 'Graph traversals · fraud analysis',    x: 74, y: 22 },
          { name: 'Salesforce DB', proficiency: 90, level: 'supporting', tooltip: 'SOQL reporting · CRM sync',            x: 88, y: 28 },
          { name: 'Cassandra',     proficiency: 91, level: 'supporting', tooltip: 'Time-series · partition design',       x: 80, y: 34 },
        ]
      },
      {
        id: 'frameworks', name: 'Frameworks', color: '#FFB74D', glowColor: 'rgba(255,183,77,0.6)',
        skills: [
          { name: 'Spring Boot',  proficiency: 90, level: 'secondary',  tooltip: 'Production APIs · Spring Security',    x: 6,  y: 48 },
          { name: 'Echo',         proficiency: 91, level: 'secondary',  tooltip: 'Lean Go APIs · sub-ms overhead',       x: 18, y: 54 },
          { name: 'Dropwizard',   proficiency: 92, level: 'supporting', tooltip: 'Metrics-first · predictable latency',  x: 32, y: 50 },
          { name: 'Google Guice', proficiency: 90, level: 'supporting', tooltip: 'Modular DI for non-Spring Java',       x: 12, y: 64 },
        ]
      },
      {
        id: 'ai', name: 'AI / ML', color: '#F48FB1', glowColor: 'rgba(244,143,177,0.6)',
        skills: [
          { name: 'Generative AI',    proficiency: 90, level: 'primary',   tooltip: 'Cut manual triage effort by 50%',      x: 38, y: 46 },
          { name: 'LLM',              proficiency: 90, level: 'primary',   tooltip: 'API integration · tool-calling',       x: 54, y: 40 },
          { name: 'RAG',              proficiency: 92, level: 'secondary', tooltip: 'Rerank pipelines · less hallucination', x: 42, y: 60 },
          { name: 'VectorDB',         proficiency: 90, level: 'secondary', tooltip: 'Pinecone · pgvector · semantic search', x: 60, y: 56 },
          { name: 'Semantic Caching', proficiency: 89, level: 'secondary', tooltip: 'Embedding cache · cut LLM cost & latency', x: 46, y: 70 },
          { name: 'MCP Servers',      proficiency: 88, level: 'secondary', tooltip: 'Model Context Protocol · tool gateways', x: 64, y: 66 },
          { name: 'Bedrock',          proficiency: 88, level: 'supporting', tooltip: 'AWS Bedrock · multi-model hosting',     x: 56, y: 74 },
        ]
      },
      {
        id: 'queues', name: 'Queues', color: '#81C784', glowColor: 'rgba(129,199,132,0.6)',
        skills: [
          { name: 'Kafka',     proficiency: 99, level: 'primary',    tooltip: 'Event pipelines · high throughput',     x: 76, y: 48 },
          { name: 'RabbitMQ',  proficiency: 90, level: 'secondary',  tooltip: 'Task queues · dead-letter retries',     x: 88, y: 54 },
          { name: 'AmazonSQS', proficiency: 92, level: 'supporting', tooltip: 'Serverless fan-out · FIFO queues',     x: 80, y: 64 },
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
          { name: 'Elasti-Cache', proficiency: 91, level: 'supporting', tooltip: 'Redis clusters · failover · TTL',     x: 74, y: 76 },
          { name: 'Redis',        proficiency: 90, level: 'secondary',  tooltip: 'Leaderboards · rate limiting · sub-ms', x: 88, y: 74 },
        ]
      }
    ];
  }

  private addSkillDetails(): void {
    this.constellations.forEach(c => {
      c.skills.forEach(s => { if (SKILL_DETAILS[s.name]) s.details = SKILL_DETAILS[s.name]; });
    });
  }

  toggleSystemMode(): void {
    this.systemMode = !this.systemMode;
  }

  getDisplayName(skill: Skill): string {
    const systemLabel = this.systemModeLabels[skill.name];
    if (this.systemMode && systemLabel) {
      return systemLabel;
    }
    return skill.name;
  }

  isSystemFlowNode(skill: Skill): boolean {
    return this.systemMode && this.systemModeFlow.includes(skill.name);
  }

  getSystemFlowIndex(skill: Skill): number {
    return this.systemModeFlow.indexOf(skill.name);
  }

  getLevelLabel(level: SkillLevel): string {
    return level === 'primary' ? 'Boss' : level === 'secondary' ? 'Main' : 'Support';
  }

  getLevelTag(level: SkillLevel): string {
    return level === 'primary' ? 'BOSS' : level === 'secondary' ? 'MAIN' : 'SUPPORT';
  }

  getSkillDetailsId(skill: Skill): string {
    return `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-details`;
  }

  toggleCard(skill: Skill): void {
    if (this.expandedSkill === skill) {
      this.expandedSkill = null;
      return;
    }
    this.expandedSkill = skill;
    this.achievements.trackSkillExpand();
    this.audio.play('powerUp');
  }

  isExpanded(skill: Skill): boolean {
    return this.expandedSkill === skill;
  }

}
