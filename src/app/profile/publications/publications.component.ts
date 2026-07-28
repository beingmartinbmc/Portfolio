import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {PROJECT_LINKS, COMPANY_LINKS} from '../../config/profile-links';
import {CommonModule} from '@angular/common';
import {
  OpenSourceProject,
  OPEN_SOURCE_PROJECTS
} from './publications.data';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class PublicationsComponent implements OnInit {
  readonly projectLinks = PROJECT_LINKS;
  readonly companyLinks = COMPANY_LINKS;

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
