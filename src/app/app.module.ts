import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StaticContentModule } from "./modules/static-content/static-content.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StaticContentModule,
    ProjectsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  // {provide: APP_BASE_HREF, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? '/en/' : `/${navigator.language}/`}
  providers: [],
  bootstrap: [AppComponent]
})
// {provide: LOCALE_ID, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? 'en' : navigator.language }
export class AppModule {
  constructor(){
    console.log((navigator.language !== 'en' && navigator.language !== 'es')? '/en' : `/${navigator.language}`)
  }
}
