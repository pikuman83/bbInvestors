import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './modules/dynamic-content/projects/projects.component';
import { AboutComponent } from './modules/static-content/about/about.component';
import { InicioComponent } from './modules/static-content/inicio/inicio.component';
import { NewsComponent } from './modules/static-content/news/news.component';
import { ServicesComponent } from './modules/static-content/services/services.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: InicioComponent},
  {path: 'about', component: AboutComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'news', component: NewsComponent},
  {path: 'projects', loadChildren: () => import('./modules/dynamic-content/dynamic.module').then(m => m.DynamicModule) },
  {path: 'projects/:city', component: ProjectsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
