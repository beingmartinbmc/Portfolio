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
  interval: any;

  constructor(private timeService: TimeService) {
  }

  private refreshData() {
    this.timeService.getNumberOfMonths()
      .subscribe(data => {
        this.numberOfMonths = data;
      });
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
