import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BLOG_LINKS } from '../../config/profile-links';
import { AchievementsService } from '../../services/achievements.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class BlogComponent {
  readonly blogLinks = BLOG_LINKS;
  private readonly visitedBlogs = new Set<string>();

  constructor(
    private achievements: AchievementsService,
    private audio: AudioService
  ) {}

  onBlogClick(blogId: string): void {
    if (!this.visitedBlogs.has(blogId)) {
      this.visitedBlogs.add(blogId);
      this.achievements.trackBlogClick();
    }
    this.audio.play('pipe');
  }
}