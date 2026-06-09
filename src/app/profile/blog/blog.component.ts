import { Component } from '@angular/core';
import { BLOG_LINKS } from '../../config/profile-links';
import { AchievementsService } from '../../services/achievements.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true
})
export class BlogComponent {
  readonly blogLinks = BLOG_LINKS;

  constructor(
    private achievements: AchievementsService,
    private audio: AudioService
  ) {}

  onBlogClick(): void {
    this.achievements.trackBlogClick();
    this.audio.play('pipe');
  }
}