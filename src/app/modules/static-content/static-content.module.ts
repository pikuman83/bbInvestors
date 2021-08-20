import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { InicioComponent } from './inicio/inicio.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { NewsComponent } from './news/news.component';
import { NewsAdminComponent } from './news/news-admin/news-admin.component';

@NgModule({
  declarations: [
    InicioComponent,
    ContactComponent,
    AboutComponent,
    ServicesComponent,
    NewsComponent,
    NewsAdminComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    ContactComponent
  ]
})
export class StaticContentModule { }
