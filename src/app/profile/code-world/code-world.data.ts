export interface CodeRealm {
  readonly id: string;
  readonly file: string;
  readonly title: string;
  /** A code glyph for the map chip. */
  readonly glyph: string;
  readonly x: number;
  readonly y: number;
  readonly code: string;
}

/** Every place on the page, in reading order, as a realm you can run. */
export const CODE_REALMS: readonly CodeRealm[] = [
  {
    id: 'top',
    file: 'main.ts',
    title: 'Origin',
    glyph: '{}',
    x: 12, y: 16,
    code: `export const ankit = {
  role: 'Senior Backend Engineer',
  focus: ['distributed systems', 'AI platforms'],
  now: 'SMTS, Salesforce',
  openTo: 'conversations',
};`,
  },
  {
    id: 'about',
    file: 'about.ts',
    title: 'About',
    glyph: '//',
    x: 34, y: 10,
    code: `export const about = {
  years: '6+',
  bias: 'backend first',
  ai: 'where it earns its place',
  owns: ['latency', 'correctness', 'on-call'],
};`,
  },
  {
    id: 'experience',
    file: 'experience.ts',
    title: 'Work',
    glyph: '=>',
    x: 58, y: 18,
    code: `export const worlds = [
  'Salesforce',
  'Games24x7',
  'Walmart Global Tech',
  'Extramarks Education',
] as const;`,
  },
  {
    id: 'metrics',
    file: 'telemetry.ts',
    title: 'Impact',
    glyph: 'Σ',
    x: 80, y: 12,
    code: `export const telemetry = {
  sessions: '50K+',
  screenedPerDay: '2M+',
  supportAutomated: '65%',
};`,
  },
  {
    id: 'publications',
    file: 'quests.ts',
    title: 'Projects',
    glyph: '</>',
    x: 86, y: 36,
    code: `export const quests = [
  'SIP/PSTN telephony',
  'AI support bot',
  'KYC platform',
  'Risk rule engine',
  'Fantasy autoscaler',
];`,
  },
  {
    id: 'open-source',
    file: 'packages.ts',
    title: 'Open source',
    glyph: 'npm',
    x: 64, y: 34,
    code: `export const packages = [
  'node-actuator-lite',
  'node-request-trace',
  'eli5',
  'roastcode',
];`,
  },
  {
    id: 'skill',
    file: 'inventory.ts',
    title: 'Skills',
    glyph: '[]',
    x: 40, y: 32,
    code: `export const stack = {
  languages: ['Java', 'Go', 'Python'],
  core: ['Kafka', 'Spring', 'Kubernetes'],
  ai: ['RAG', 'LLM tools', 'MCP'],
};`,
  },
  {
    id: 'blogs',
    file: 'scrolls.ts',
    title: 'Writing',
    glyph: '/**/',
    x: 16, y: 40,
    code: `export const notes = [
  'Fortress of Fair Play',
  'Neptune Navigator',
  'Where Trust Meets Gameplay',
];`,
  },
  {
    id: 'avatar-3d',
    file: 'twin.ts',
    title: 'AI twin',
    glyph: 'AI',
    x: 14, y: 64,
    code: `export const twin = {
  model: '3D avatar',
  voice: 'optional',
  context: 'curated career facts',
};`,
  },
  {
    id: 'education',
    file: 'training.ts',
    title: 'Education',
    glyph: 'λ',
    x: 38, y: 70,
    code: `export const education = {
  degree: 'B.Tech Computer Science',
  honors: true,
  school: 'GLA University',
};`,
  },
  {
    id: 'operating-style',
    file: 'profile.ts',
    title: 'Approach',
    glyph: 'if',
    x: 64, y: 74,
    code: `export const approach = {
  start: 'constraints',
  prefer: 'boring infrastructure',
  ship: 'reliability over novelty',
};`,
  },
  {
    id: 'ai-quiz-game',
    file: 'mario.ts',
    title: 'Game',
    glyph: '▶',
    x: 86, y: 82,
    code: `export const lab = {
  kind: 'AI Mario',
  generates: ['layout', 'enemies', 'words'],
  you: 'just play',
};`,
  },
];
