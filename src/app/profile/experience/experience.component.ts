import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef, NgZone, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { EXPERIENCE_ITEMS, EXPERIENCE_START_DATE, ExperienceItem } from './experience.data';
import { AchievementsService } from '../../services/achievements.service';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: []
})
export class ExperienceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapTrack') mapTrack?: ElementRef<HTMLElement>;
  @ViewChildren('stopEl') stopEls?: QueryList<ElementRef<HTMLElement>>;

  totalExperience = '0.0';
  stops: TimelineStop[] = [];
  activeStop: TimelineStop | null = null;
  activeRole: ExperienceItem | null = null;
  marioPosition = -1; // index of the stop Mario is at

  // Travelling-Mario state (Mario actually runs between stops)
  marioLeft = 0;          // px offset within the track
  marioRunning = false;   // toggles the run-cycle animation
  marioFacingLeft = false;

  private runTimer: any = null;
  private readonly visitedStopIds = new Set<string>();

  private readonly experienceItems: ExperienceItem[] = EXPERIENCE_ITEMS;

  constructor(
    private zone: NgZone,
    private achievements: AchievementsService,
  ) {}

  ngOnInit(): void {
    this.calculateTotalExperience();
    this.buildTimeline();
    this.marioPosition = this.stops.length - 1;
  }

  ngAfterViewInit(): void {
    // Place Mario at the most recent role once the layout is measured.
    requestAnimationFrame(() => this.moveMarioTo(this.marioPosition, false));
  }

  ngOnDestroy(): void {
    if (this.runTimer) clearTimeout(this.runTimer);
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
    if (!this.visitedStopIds.has(stop.id)) {
      this.visitedStopIds.add(stop.id);
      this.achievements.trackExperienceStop();
    }
    this.moveMarioTo(idx, true);
  }

  /**
   * Moves Mario to the centre of the stop at `idx` by measuring real DOM
   * positions, so the run animation always lands precisely on the platform
   * regardless of how the flex layout distributes the stops.
   */
  private moveMarioTo(idx: number, animate: boolean): void {
    this.marioPosition = idx;
    const track = this.mapTrack?.nativeElement;
    const stopEl = this.stopEls?.get(idx)?.nativeElement;
    if (!track || !stopEl) return;

    const trackRect = track.getBoundingClientRect();
    const stopRect = stopEl.getBoundingClientRect();
    const targetLeft = stopRect.left - trackRect.left + stopRect.width / 2;

    if (animate && targetLeft !== this.marioLeft) {
      this.marioFacingLeft = targetLeft < this.marioLeft;
      this.marioRunning = true;
      if (this.runTimer) clearTimeout(this.runTimer);
      // Match the CSS travel transition duration (0.9s).
      this.zone.runOutsideAngular(() => {
        this.runTimer = setTimeout(() => {
          this.zone.run(() => { this.marioRunning = false; });
        }, 950);
      });
    }
    this.marioLeft = targetLeft;
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
