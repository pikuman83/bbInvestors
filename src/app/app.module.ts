import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StaticContentModule } from "./modules/static-content/static-content.module";
import { ProjectsModule } from "./modules/projects/projects.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StaticContentModule,
    ProjectsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
