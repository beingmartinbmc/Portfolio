import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

interface OpenSourceProject {
  id: string;
  title: string;
  description: string;
  category: 'NPM' | 'Maven Central' | 'GitHub' | 'PyPI';
  badges: {
    version?: string;
    downloads?: string;
    total?: string;
    java?: string;
  };
  link: string;
  linkText: string;
}

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PublicationsComponent implements OnInit {
  openSourceProjects: OpenSourceProject[] = [
    {
      id: 'node-actuator-lite',
      title: 'node-actuator-lite',
      description: 'A lightweight Node.js actuator similar to Spring Boot actuator with Prometheus integration, built with minimal external dependencies for maximum performance. Perfect for serverless platforms like Vercel, AWS Lambda, and microservices.',
      category: 'NPM',
      badges: {
        version: 'https://img.shields.io/npm/v/node-actuator-lite?style=flat-square&logo=npm&color=cb3837&label=version',
        downloads: 'https://img.shields.io/npm/dm/node-actuator-lite?style=flat-square&logo=npm&color=cb3837&label=downloads/month',
        total: 'https://img.shields.io/npm/dt/node-actuator-lite?style=flat-square&logo=npm&color=cb3837&label=total'
      },
      link: 'https://www.npmjs.com/package/node-actuator-lite',
      linkText: 'View on NPM'
    },
    {
      id: 'meme-as-a-service',
      title: 'meme-as-a-service',
      description: 'A fun and lightweight service for generating and serving memes programmatically. Provides easy-to-use APIs for creating custom memes with text overlays and various templates.',
      category: 'NPM',
      badges: {
        version: 'https://img.shields.io/npm/v/meme-as-a-service?style=flat-square&logo=npm&color=cb3837&label=version',
        downloads: 'https://img.shields.io/npm/dm/meme-as-a-service?style=flat-square&logo=npm&color=cb3837&label=downloads/month',
        total: 'https://img.shields.io/npm/dt/meme-as-a-service?style=flat-square&logo=npm&color=cb3837&label=total'
      },
      link: 'https://www.npmjs.com/package/meme-as-a-service',
      linkText: 'View on NPM'
    },
    {
      id: 'roastcode',
      title: 'roastcode',
      description: '🔥 A CLI tool that humorously roasts your code files, commit messages, and diffs with AI-powered savagery. Features multiple roast modes (Gentle, Savage, Toxic), AI engines (OpenAI, Ollama), git integration, meme generation, and smart code analysis. Perfect for code reviews, team bonding, and keeping your codebase honest.',
      category: 'NPM',
      badges: {
        version: 'https://img.shields.io/npm/v/roastcode?style=flat-square&logo=npm&color=cb3837&label=version',
        downloads: 'https://img.shields.io/npm/dm/roastcode?style=flat-square&logo=npm&color=cb3837&label=downloads/month',
        total: 'https://img.shields.io/npm/dt/roastcode?style=flat-square&logo=npm&color=cb3837&label=total'
      },
      link: 'https://www.npmjs.com/package/roastcode',
      linkText: 'View on NPM'
    },
    {
      id: 'readme-cinema',
      title: 'readme-cinema',
      description: '🎬 Transform your README files into cinematic terminal experiences with ASCII art, typewriter effects, and dramatic transitions. Features 8 color themes, progress bars, syntax highlighting, and movie-like scene transitions for creating engaging documentation.',
      category: 'NPM',
      badges: {
        version: 'https://img.shields.io/npm/v/readme-cinema?style=flat-square&logo=npm&color=cb3837&label=version',
        downloads: 'https://img.shields.io/npm/dm/readme-cinema?style=flat-square&logo=npm&color=cb3837&label=downloads/week',
        total: 'https://img.shields.io/npm/dt/readme-cinema?style=flat-square&logo=npm&color=cb3837&label=total'
      },
      link: 'https://www.npmjs.com/package/readme-cinema',
      linkText: 'View on NPM'
    },
    {
      id: 'eli5',
      title: 'eli5',
      description: 'Explain Like I\'m 5 annotations for Java code documentation with AI-powered explanations. A Maven plugin that helps developers create simple, understandable documentation for complex code by generating child-friendly explanations.',
      category: 'Maven Central',
      badges: {
        version: 'https://img.shields.io/maven-central/v/io.github.beingmartinbmc/eli5?style=flat-square&logo=apache-maven&color=c71a36&label=version',
        java: 'https://img.shields.io/badge/Java-11+-orange?style=flat-square&logo=java&color=ED8B00'
      },
      link: 'https://central.sonatype.com/artifact/io.github.beingmartinbmc/eli5/1.0.1/overview',
      linkText: 'View on Maven Central'
    },
    {
      id: 'git-history-ui',
      title: 'git-history-ui',
      description: 'A beautiful, modern web UI for visualizing git history with interactive commit graphs, search, filtering, and diff visualization. Built with Angular and Node.js. Features D3.js-powered visualizations, advanced search & filtering, dual view modes, color palette system, and responsive design.',
      category: 'NPM',
      badges: {
        version: 'https://img.shields.io/npm/v/git-history-ui?style=flat-square&logo=npm&color=cb3837&label=version',
        downloads: 'https://img.shields.io/npm/dm/git-history-ui?style=flat-square&logo=npm&color=cb3837&label=downloads/week',
        total: 'https://img.shields.io/npm/dt/git-history-ui?style=flat-square&logo=npm&color=cb3837&label=total'
      },
      link: 'https://www.npmjs.com/package/git-history-ui',
      linkText: 'View on NPM'
    }
  ];

  availableCategories: string[] = [];
  selectedCategory: string = 'All';
  filteredProjects: OpenSourceProject[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.availableCategories = ['All', ...Array.from(new Set(this.openSourceProjects.map(p => p.category)))];
    this.filteredProjects = this.openSourceProjects;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProjects = this.openSourceProjects;
    } else {
      this.filteredProjects = this.openSourceProjects.filter(project => project.category === category);
    }
  }
}
