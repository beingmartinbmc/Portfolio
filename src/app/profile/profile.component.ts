import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
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
    BlogComponent
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    // Handle navigation and scroll to fragments
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.handleFragmentNavigation();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleFragmentNavigation() {
    this.route.fragment.pipe(
      takeUntil(this.destroy$)
    ).subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    });
  }

}
