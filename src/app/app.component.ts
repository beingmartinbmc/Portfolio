import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ProfileComponent} from './profile/profile.component';
import {AchievementToastComponent} from './shared/achievement-toast/achievement-toast.component';
import {MiniMapComponent} from './shared/mini-map/mini-map.component';
import {LevelUpOverlayComponent} from './shared/level-up-overlay/level-up-overlay.component';
import {KonamiComponent} from './shared/konami/konami.component';
import {CursorTrailComponent} from './shared/cursor-trail/cursor-trail.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ProfileComponent,
    AchievementToastComponent,
    MiniMapComponent,
    LevelUpOverlayComponent,
    KonamiComponent,
    CursorTrailComponent,
  ]
})
export class AppComponent {
  title = 'personal-portfolio-angular';
}
