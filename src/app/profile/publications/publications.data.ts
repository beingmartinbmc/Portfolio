import {PACKAGE_LINKS} from '../../config/profile-links';

export interface OpenSourceProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'NPM' | 'Maven Central' | 'GitHub' | 'PyPI';
  link: string;
  linkText: string;
}

export const OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    id: 'node-actuator-lite',
    title: 'node-actuator-lite',
    tagline: 'Spring Boot-style health checks for Node.js — zero deps',
    description: 'A lightweight Node.js actuator similar to Spring Boot actuator with Prometheus integration, built with minimal external dependencies for maximum performance. Perfect for serverless platforms like Vercel, AWS Lambda, and microservices.',
    category: 'NPM',
    link: PACKAGE_LINKS.nodeActuatorLite,
    linkText: 'View on NPM'
  },
  {
    id: 'node-request-trace',
    title: 'node-request-trace',
    tagline: 'See exactly where your API request spends time',
    description: 'Request tracing and performance visualization library for Node.js. Inspect the full execution lifecycle of API requests, detect performance bottlenecks, identify slow middleware or async operations, and debug production issues quickly.',
    category: 'NPM',
    link: PACKAGE_LINKS.nodeRequestTrace,
    linkText: 'View on NPM'
  },
  {
    id: 'node-eventloop-watchdog',
    title: 'node-eventloop-watchdog',
    tagline: 'Find exactly which line is blocking your event loop',
    description: 'Lightweight Node.js event loop blocking detector with automatic code identification, blocking heatmaps, and production-safe diagnostics. Detects lag, captures blocking stack traces, identifies hotspots, and correlates with HTTP requests.',
    category: 'NPM',
    link: PACKAGE_LINKS.nodeEventloopWatchdog,
    linkText: 'View on NPM'
  },
  {
    id: 'meme-as-a-service',
    title: 'meme-as-a-service',
    tagline: 'Generate memes via API — templates, text overlays, done',
    description: 'A fun and lightweight service for generating and serving memes programmatically. Provides easy-to-use APIs for creating custom memes with text overlays and various templates.',
    category: 'NPM',
    link: PACKAGE_LINKS.memeAsAService,
    linkText: 'View on NPM'
  },
  {
    id: 'roastcode',
    title: 'roastcode',
    tagline: 'AI code review, but it roasts you',
    description: '🔥 A CLI tool that humorously roasts your code files, commit messages, and diffs with AI-powered savagery. Features multiple roast modes (Gentle, Savage, Toxic), AI engines (OpenAI, Ollama), git integration, meme generation, and smart code analysis. Perfect for code reviews, team bonding, and keeping your codebase honest.',
    category: 'NPM',
    link: PACKAGE_LINKS.roastcode,
    linkText: 'View on NPM'
  },
  {
    id: 'readme-cinema',
    title: 'readme-cinema',
    tagline: 'Turn READMEs into cinematic terminal experiences',
    description: '🎬 Transform your README files into cinematic terminal experiences with ASCII art, typewriter effects, and dramatic transitions. Features 8 color themes, progress bars, syntax highlighting, and movie-like scene transitions for creating engaging documentation.',
    category: 'NPM',
    link: PACKAGE_LINKS.readmeCinema,
    linkText: 'View on NPM'
  },
  {
    id: 'eli5',
    title: 'eli5',
    tagline: 'AI-powered "Explain Like I\'m 5" annotations for Java',
    description: 'Explain Like I\'m 5 annotations for Java code documentation with AI-powered explanations. A Maven plugin that helps developers create simple, understandable documentation for complex code by generating child-friendly explanations.',
    category: 'Maven Central',
    link: PACKAGE_LINKS.eli5,
    linkText: 'View on Maven Central'
  },
  {
    id: 'git-history-ui',
    title: 'git-history-ui',
    tagline: 'Beautiful web UI for exploring git history',
    description: 'A beautiful, modern web UI for visualizing git history with interactive commit graphs, search, filtering, and diff visualization. Built with Angular and Node.js. Features D3.js-powered visualizations, advanced search & filtering, dual view modes, color palette system, and responsive design.',
    category: 'NPM',
    link: PACKAGE_LINKS.gitHistoryUi,
    linkText: 'View on NPM'
  }
];
