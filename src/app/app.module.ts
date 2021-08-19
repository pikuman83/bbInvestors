import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from "./modules/shared/shared.module";
import { StaticContentModule } from "./modules/static-content/static-content.module";
import { ProjectsModule } from "./modules/projects/projects.module";

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    StaticContentModule,
    ProjectsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  // {provide: APP_BASE_HREF, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? '/en/' : `/${navigator.language}/`}
  providers: [],
  bootstrap: [AppComponent]
})
// {provide: LOCALE_ID, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? 'en' : navigator.language }
export class AppModule {}
