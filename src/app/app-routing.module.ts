import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateAreaComponent } from './modules/dynamic-content/private-area/private-area.component';
import { ProjectsDetailsComponent } from './modules/dynamic-content/projects/projects-details/projects-details.component';
import { ProjectsComponent } from './modules/dynamic-content/projects/projects.component';
import { AboutComponent } from './modules/static-content/about/about.component';
import { ContactComponent } from './modules/static-content/contact/contact.component';
import { InicioComponent } from './modules/static-content/inicio/inicio.component';
import { LandingComponent } from './modules/static-content/landing/landing.component';
import { NewsComponent } from './modules/static-content/news/news.component';
import { ServicesComponent } from './modules/static-content/services/services.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['projects']);

const routes: Routes = [
  {path: '', redirectTo: '/routing', pathMatch: 'full'},
  {path: 'routing', component: LandingComponent},
  {path: 'home', component: InicioComponent},
  {path: 'about', component: AboutComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'news', component: NewsComponent},
  {path: 'projects', loadChildren: () => import('./modules/dynamic-content/dynamic.module').then(m => m.DynamicModule) },
  {path: 'projects/:city', component: ProjectsComponent },
  {path: 'projects/project-details/:id', component: ProjectsDetailsComponent },
  {path: 'contact/:param', component: ContactComponent },
  {path: 'privateArea', component: PrivateAreaComponent, ...canActivate(redirectUnauthorizedToLogin)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
