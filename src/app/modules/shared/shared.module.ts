import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FileUploadComponent } from './file-upload/file-upload.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';

import { LoginComponent } from './login/login.component';
import { CredentialsPromptComponent } from './login/credentials-prompt/credentials-prompt.component';
import { RecaptchaModule, RecaptchaFormsModule  } from "ng-recaptcha";

@NgModule({
  declarations: [
    FileUploadComponent,
    LoginComponent,
    CredentialsPromptComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatChipsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  exports: [
    CommonModule,
    FileUploadComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatChipsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}}
  ]
})
export class SharedModule { }
