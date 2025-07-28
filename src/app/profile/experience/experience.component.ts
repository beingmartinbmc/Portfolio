import {Component, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from '../../time.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  standalone: true
})
export class ExperienceComponent implements OnInit, OnDestroy {

  numberOfMonths: number;
  totalExperience: string;
  interval: any;

  constructor(private timeService: TimeService) {
  }

  private calculateTotalExperience(): void {
    const startDate = new Date('2019-12-20');
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = diffDays / 365.25;
    this.totalExperience = diffYears.toFixed(1);
  }

  private refreshData() {
    this.timeService.getNumberOfMonths()
      .subscribe(data => {
        this.numberOfMonths = data;
      });
    this.calculateTotalExperience();
  }

  ngOnInit(): void {
    this.refreshData();
    this.interval = setInterval(() => {
      this.refreshData();
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
