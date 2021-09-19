import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { SharedModule } from "./modules/shared/shared.module";
import { StaticContentModule } from "./modules/static-content/static-content.module";
import { DynamicModule } from "./modules/dynamic-content/dynamic.module";

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    StaticContentModule,
    DynamicModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
  ],
  // {provide: APP_BASE_HREF, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? '/en/' : `/${navigator.language}/`}
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// {provide: LOCALE_ID, useValue: (navigator.language !== 'en' && navigator.language !== 'es')? 'en' : navigator.language }
export class AppModule {}
