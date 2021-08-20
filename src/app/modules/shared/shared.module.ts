import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../app-routing.module';

import { ReactiveFormsModule } from '@angular/forms';

import { FileUploadComponent } from './file-upload/file-upload.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
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
    AppRoutingModule
  ],
  exports: [
    FileUploadComponent, 
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule,
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
    AppRoutingModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
export class SharedModule { }
