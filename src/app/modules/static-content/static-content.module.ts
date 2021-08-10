import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { NewsComponent } from './news/news.component';



@NgModule({
  declarations: [
    InicioComponent,
    ContactComponent,
    AboutComponent,
    ServicesComponent,
    NewsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class StaticContentModule { }
