import { Component, OnInit } from '@angular/core';
import { EXPERIENCE_ITEMS, EXPERIENCE_START_DATE, ExperienceItem } from './experience.data';

interface TimelineStop {
  id: string;
  company: string;
  logo: string;
  roles: ExperienceItem[];
  isCurrent: boolean;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  standalone: true,
  imports: []
})
export class ExperienceComponent implements OnInit {
  totalExperience = '0.0';
  stops: TimelineStop[] = [];
  activeStop: TimelineStop | null = null;
  activeRole: ExperienceItem | null = null;
  marioPosition = -1; // index of the stop Mario is at

  private readonly experienceItems: ExperienceItem[] = EXPERIENCE_ITEMS;

  ngOnInit(): void {
    this.calculateTotalExperience();
    this.buildTimeline();
    this.marioPosition = this.stops.length - 1;
  }

  private calculateTotalExperience(): void {
    const start = new Date(EXPERIENCE_START_DATE);
    const now = new Date();
    const years = Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    this.totalExperience = years.toFixed(1);
  }

  private buildTimeline(): void {
    const companyMap = new Map<string, ExperienceItem[]>();
    const order: string[] = [];

    this.experienceItems.forEach(item => {
      if (!companyMap.has(item.company)) {
        companyMap.set(item.company, []);
        order.push(item.company);
      }
      companyMap.get(item.company)!.push(item);
    });

    this.stops = order.reverse().map(company => {
      const roles = companyMap.get(company)!;
      return {
        id: company.toLowerCase().replace(/\s+/g, '-'),
        company,
        logo: roles[0].logo,
        roles,
        isCurrent: roles.some(r => r.duration === 'Current')
      };
    });
  }

  selectStop(stop: TimelineStop, idx: number): void {
    if (this.activeStop === stop) {
      this.activeStop = null;
      this.activeRole = null;
      return;
    }
    this.activeStop = stop;
    this.activeRole = stop.roles[0];
    this.marioPosition = idx;
  }

  selectRole(role: ExperienceItem): void {
    this.activeRole = role;
  }

  isStopActive(stop: TimelineStop): boolean {
    return this.activeStop === stop;
  }

  getStopPeriod(stop: TimelineStop): string {
    if (stop.roles.length === 1) return stop.roles[0].period;
    const periods = stop.roles.map(r => r.period);
    const first = periods[periods.length - 1];
    const last = periods[0];
    const startYear = first.split(' - ')[0].split(' ')[0];
    const endPart = last.includes('Present') ? 'Present' : last.split(' - ')[1]?.trim() || last;
    return `${startYear} - ${endPart}`;
  }
}
