import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef, NgZone, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  marioScrubbing = false; // scroll-driven travel skips the click transition

  private runTimer: ReturnType<typeof setTimeout> | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private scrollFrame = 0;
  private pinned = false;
  private pinY = 0;
  private listening = false;
  private readonly visitedStopIds = new Set<string>();
  private readonly onMapScroll = (): void => {
    if (this.scrollFrame) return;
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = 0;
      this.scrubMario();
    });
  };

  private readonly experienceItems: ExperienceItem[] = EXPERIENCE_ITEMS;

  constructor(
    private zone: NgZone,
    private achievements: AchievementsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.calculateTotalExperience();
    this.buildTimeline();
    this.marioPosition = this.stops.length - 1;
  }

  ngAfterViewInit(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      if (reduce) this.moveMarioTo(this.stops.length - 1, false);
      else this.scrubMario();
      this.cdr.markForCheck();
    });
    if (reduce) return;
    this.listening = true;
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onMapScroll, { passive: true });
      window.addEventListener('resize', this.onMapScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (this.runTimer) clearTimeout(this.runTimer);
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame);
    if (this.listening) {
      window.removeEventListener('scroll', this.onMapScroll);
      window.removeEventListener('resize', this.onMapScroll);
    }
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
        logo: roles[0]?.logo ?? '',
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
    this.activeRole = stop.roles[0] ?? null;
    if (!this.visitedStopIds.has(stop.id)) {
      this.visitedStopIds.add(stop.id);
      this.achievements.trackExperienceStop();
    }
    this.pinned = true;
    this.pinY = window.scrollY || 0;
    this.moveMarioTo(idx, true);
  }

  /**
   * Scroll progress across the map: 0 as the track enters from below,
   * 1 once it has settled in the upper part of the viewport.
   * rin: one linear map, not a per-stop timeline.
   */
  private scrubMario(): void {
    if (this.pinned && Math.abs((window.scrollY || 0) - this.pinY) < 12) return;
    this.pinned = false;

    const track = this.mapTrack?.nativeElement;
    const max = this.stops.length - 1;
    if (!track || max < 0) return;

    const view = window.innerHeight || 1;
    const raw = (view * 0.92 - track.getBoundingClientRect().top) / (view * 0.7);
    const progress = Math.min(1, Math.max(0, raw));
    const pos = progress * max;
    const index = Math.min(max, Math.floor(pos));
    const next = Math.min(max, index + 1);
    const start = this.stopCenter(index);
    const end = this.stopCenter(next);
    if (start == null || end == null) return;

    const left = start + (end - start) * (pos - index);
    const delta = left - this.marioLeft;
    const moved = Math.abs(delta) > 0.5;
    const facing = moved ? delta < 0 : this.marioFacingLeft;
    const position = (pos - index) < 0.5 ? index : next;
    const changed = !this.marioScrubbing || moved || facing !== this.marioFacingLeft || position !== this.marioPosition;
    this.marioScrubbing = true;
    this.marioLeft = left;
    this.marioFacingLeft = facing;
    this.marioPosition = position;
    if (moved) {
      this.marioRunning = true;
      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.zone.runOutsideAngular(() => {
        this.idleTimer = setTimeout(() => {
          this.zone.run(() => {
            this.marioRunning = false;
            this.cdr.markForCheck();
          });
        }, 140);
      });
    }
    if (changed) this.cdr.markForCheck();
  }

  private stopCenter(idx: number): number | null {
    const track = this.mapTrack?.nativeElement;
    const stopEl = this.stopEls?.get(idx)?.nativeElement;
    if (!track || !stopEl) return null;
    const trackRect = track.getBoundingClientRect();
    const stopRect = stopEl.getBoundingClientRect();
    return stopRect.left - trackRect.left + stopRect.width / 2;
  }

  /** Click travel. Measures the stop so the run lands on the platform. */
  private moveMarioTo(idx: number, animate: boolean): void {
    this.marioPosition = idx;
    this.marioScrubbing = false;
    const targetLeft = this.stopCenter(idx);
    if (targetLeft == null) return;

    if (animate && targetLeft !== this.marioLeft) {
      this.marioFacingLeft = targetLeft < this.marioLeft;
      this.marioRunning = true;
      if (this.runTimer) clearTimeout(this.runTimer);
      // Match the CSS travel transition duration (0.9s).
      this.zone.runOutsideAngular(() => {
        this.runTimer = setTimeout(() => {
          this.zone.run(() => { this.marioRunning = false; this.cdr.markForCheck(); });
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
    const periods = stop.roles.map(r => r.period);
    const first = periods[periods.length - 1];
    const last = periods[0];
    if (!first || !last) return '';
    if (periods.length === 1) return first;
    const startYear = first.split(' - ')[0] ?? first;
    const endPart = last.includes('Present') ? 'Present' : last.split(' - ')[1]?.trim() || last;
    return `${startYear} - ${endPart}`;
  }
}
