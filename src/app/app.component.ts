import {Component} from '@angular/core';
import {ProfileComponent} from './profile/profile.component';
import {AchievementToastComponent} from './shared/achievement-toast/achievement-toast.component';
import {MiniMapComponent} from './shared/mini-map/mini-map.component';
import {LevelUpOverlayComponent} from './shared/level-up-overlay/level-up-overlay.component';
import {KonamiComponent} from './shared/konami/konami.component';
import {CursorTrailComponent} from './shared/cursor-trail/cursor-trail.component';
import {LoaderComponent} from './shared/loader/loader.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ProfileComponent,
    AchievementToastComponent,
    MiniMapComponent,
    LevelUpOverlayComponent,
    KonamiComponent,
    CursorTrailComponent,
    LoaderComponent,
  ]
})
export class AppComponent {
  title = 'personal-portfolio-angular';
}
