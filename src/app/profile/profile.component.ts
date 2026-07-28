import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {IntroComponent} from './intro/intro.component';
import {AboutComponent} from './about/about.component';
import {ContactComponent} from './contact/contact.component';
import {EducationComponent} from './education/education.component';
import {ExperienceComponent} from './experience/experience.component';
import {SkillsComponent} from './skills/skills.component';
import {PublicationsComponent} from './publications/publications.component';
import {AiQuizGameComponent} from './ai-quiz-game/ai-quiz-game.component';
import {BlogComponent} from './blog/blog.component';
import {Avatar3dComponent} from './avatar-3d/avatar-3d.component';
import {MetricsDashboardComponent} from './metrics-dashboard/metrics-dashboard.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    FooterComponent,
    IntroComponent,
    Avatar3dComponent,
    AboutComponent,
    ContactComponent,
    EducationComponent,
    ExperienceComponent,
    SkillsComponent,
    PublicationsComponent,
    AiQuizGameComponent,
    BlogComponent,
    MetricsDashboardComponent
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly hashChangeHandler = () => this.scrollToCurrentHash();

  ngOnInit() {
    window.addEventListener('hashchange', this.hashChangeHandler);
    this.scrollToCurrentHash();
  }

  ngOnDestroy() {
    window.removeEventListener('hashchange', this.hashChangeHandler);
  }

  private scrollToCurrentHash(): void {
    const fragment = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (fragment) {
      this.scrollToFragment(fragment);
    }
  }

  private scrollToFragment(fragment: string) {
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

}
