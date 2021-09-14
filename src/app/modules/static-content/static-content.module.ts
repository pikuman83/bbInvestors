import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { InicioComponent } from './inicio/inicio.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { NewsComponent } from './news/news.component';
import { NewsAdminComponent } from './news/news-admin/news-admin.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  declarations: [
    InicioComponent,
    ContactComponent,
    AboutComponent,
    ServicesComponent,
    NewsComponent,
    NewsAdminComponent,
    LandingComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    ContactComponent
  ]
})
export class StaticContentModule { }
