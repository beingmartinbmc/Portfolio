import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent implements OnInit {

  ngOnInit(): void {
    this.incrementFlagCounter();
  }

  private incrementFlagCounter(): void {
    // Load the flag counter image to increment the counter
    const img = new Image();
    img.src = 'https://s04.flagcounter.com/count2/hZ3l/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_10/viewers_0/labels_1/pageviews_1/flags_0/percent_0/';
  }
}
