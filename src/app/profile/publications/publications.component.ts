import {Component, OnInit} from '@angular/core';
import {PROJECT_LINKS, COMPANY_LINKS} from '../../config/profile-links';
import {CommonModule} from '@angular/common';
import {
  OpenSourceProject,
  OPEN_SOURCE_PROJECTS,
  RRE_ARCH_NODES,
  RRE_STATS,
  RRE_TECH
} from './publications.data';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PublicationsComponent implements OnInit {
  readonly projectLinks = PROJECT_LINKS;
  readonly companyLinks = COMPANY_LINKS;
  showRREDeepDive = false;

  readonly rreArchNodes = RRE_ARCH_NODES;
  readonly rreStats = RRE_STATS;
  readonly rreTech = RRE_TECH;
  openSourceProjects: OpenSourceProject[] = OPEN_SOURCE_PROJECTS;

  availableCategories: string[] = [];
  selectedCategory = 'All';
  filteredProjects: OpenSourceProject[] = [];

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
