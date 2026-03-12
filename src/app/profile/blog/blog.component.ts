import { Component } from '@angular/core';
import { BLOG_LINKS } from '../../config/profile-links';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true
})
export class BlogComponent {
  readonly blogLinks = BLOG_LINKS;
  constructor() { }
} 