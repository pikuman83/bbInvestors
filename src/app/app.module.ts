import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { SharedModule } from "./modules/shared/shared.module";
import { StaticContentModule } from "./modules/static-content/static-content.module";
import { ProjectsModule } from "./modules/projects/projects.module";

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    StaticContentModule,
    ProjectsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence(),
  ],
  // {provide: APP_BASE_HREF, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? '/en/' : `/${navigator.language}/`}
  providers: [],
  bootstrap: [AppComponent]
})
// {provide: LOCALE_ID, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? 'en' : navigator.language }
export class AppModule {}
