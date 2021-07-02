import {Component, OnDestroy, OnInit} from '@angular/core';
import {TimeService} from '../../time.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, OnDestroy {

  constructor(private timeService: TimeService) {
  }

  numberOfMonths: number;
  interval: any;

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
