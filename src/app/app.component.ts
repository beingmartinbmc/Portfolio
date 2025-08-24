import {Component} from '@angular/core';
import {ProfileComponent} from './profile/profile.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ProfileComponent]
})
export class AppComponent {
  title = 'personal-portfolio-angular';
}
