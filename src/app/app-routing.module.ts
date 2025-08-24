import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [
  {path: '', component: ProfileComponent},
  {path: 'about', component: ProfileComponent, data: {fragment: 'about'}},
  {path: 'experience', component: ProfileComponent, data: {fragment: 'experience'}},
  {path: 'projects', component: ProfileComponent, data: {fragment: 'publications'}},
  {path: 'blogs', component: ProfileComponent, data: {fragment: 'blogs'}},
  {path: 'open-source', component: ProfileComponent, data: {fragment: 'open-source'}},
  {path: 'skills', component: ProfileComponent, data: {fragment: 'skill'}},
  {path: 'code-review', component: ProfileComponent, data: {fragment: 'ai-code-review'}},
  {path: 'education', component: ProfileComponent, data: {fragment: 'education'}},
  {path: 'contact', component: ProfileComponent, data: {fragment: 'contact'}},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
