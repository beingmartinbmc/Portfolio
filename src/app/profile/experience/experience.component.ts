import {Component, OnInit} from '@angular/core';

import {EXPERIENCE_ITEMS, EXPERIENCE_START_DATE, ExperienceItem, OrbitPlanet} from './experience.data';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  standalone: true,
  imports: []
})
export class ExperienceComponent implements OnInit {

  totalExperience = '0.0';
  planets: OrbitPlanet[] = [];
  selectedItem: ExperienceItem | null = null;

  readonly experienceItems: ExperienceItem[] = EXPERIENCE_ITEMS;

  constructor() {
  }

  private calculateTotalExperience(): void {
    const startDate = new Date(EXPERIENCE_START_DATE); // First professional role start date
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = diffDays / 365.25;
    this.totalExperience = diffYears.toFixed(1);
  }

  private buildPlanets(): void {
    const companyMap = new Map<string, ExperienceItem[]>();
    const companyLogos = new Map<string, string>();
    const order: string[] = [];

    this.experienceItems.forEach(item => {
      if (!companyMap.has(item.company)) {
        companyMap.set(item.company, []);
        order.push(item.company);
        companyLogos.set(item.company, item.logo);
      }
      companyMap.get(item.company)!.push(item);
    });

    this.planets = order.map(company => ({
      id: company.toLowerCase().replace(/\s+/g, '-'),
      company,
      logo: companyLogos.get(company)!,
      items: companyMap.get(company)!,
      isExpanded: false
    }));
  }

  getOrbitDelay(index: number): string {
    const duration = 50;
    const offset = (duration / this.planets.length) * index;
    return `-${offset}s`;
  }

  getSubOrbitDelay(index: number, total: number): string {
    const duration = 12;
    const offset = (duration / total) * index;
    return `-${offset}s`;
  }

  togglePlanet(planet: OrbitPlanet): void {
    if (planet.items.length === 1) {
      this.selectedItem = this.selectedItem === planet.items[0] ? null : planet.items[0];
      this.planets.forEach(p => p.isExpanded = false);
    } else {
      const wasExpanded = planet.isExpanded;
      this.planets.forEach(p => p.isExpanded = false);
      planet.isExpanded = !wasExpanded;
      this.selectedItem = null;
    }
  }

  selectSubItem(item: ExperienceItem): void {
    this.selectedItem = this.selectedItem === item ? null : item;
  }

  isPlanetActive(planet: OrbitPlanet): boolean {
    return planet.isExpanded || (this.selectedItem !== null && planet.items.includes(this.selectedItem));
  }

  getPlanetActionLabel(planet: OrbitPlanet): string {
    if (planet.items.length === 1) {
      return `Show experience details for ${planet.company}`;
    }

    return `${planet.isExpanded ? 'Hide' : 'Show'} roles at ${planet.company}`;
  }

  getSubItemActionLabel(item: ExperienceItem): string {
    return `Show details for ${item.title} at ${item.company}`;
  }

  ngOnInit(): void {
    this.buildPlanets();
    this.calculateTotalExperience();
  }

}
