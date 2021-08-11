import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './modules/static-content/about/about.component';
import { InicioComponent } from './modules/static-content/inicio/inicio.component';
import { NewsComponent } from './modules/static-content/news/news.component';
import { ServicesComponent } from './modules/static-content/services/services.component';

const routes: Routes = [
  {path: '', redirectTo: '/inicio', pathMatch: 'full'},
  // {path: 'en', redirectTo: '/inicio', pathMatch: 'full'},
  // {path: 'es', redirectTo: '/inicio', pathMatch: 'full'},
  {path: 'inicio', component: InicioComponent},
  {path: 'about', component: AboutComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'news', component: NewsComponent},
  { path: 'projects', loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
