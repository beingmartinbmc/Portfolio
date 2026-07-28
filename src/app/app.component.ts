import {Component, ChangeDetectionStrategy, OnDestroy, NgZone} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProfileComponent,
    AchievementToastComponent,
    MiniMapComponent,
    LevelUpOverlayComponent,
    KonamiComponent,
    CursorTrailComponent,
  ]
})
export class AppComponent implements OnDestroy {
  title = 'personal-portfolio-angular';

  private readonly onVisibilityChange = (): void => {
    document.body.classList.toggle('is-hidden-tab', document.visibilityState === 'hidden');
  };

  constructor(zone: NgZone) {
    // Purely a CSS class toggle; keep it out of Angular so backgrounded tabs cost nothing.
    zone.runOutsideAngular(() => {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    });
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
