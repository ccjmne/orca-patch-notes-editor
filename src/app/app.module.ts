import './rxjs/rxjs.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MyOwnCustomMaterialModule } from "./material/material.module";
import { MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material";

import { PatchEditorModule } from "./patch-editor/patch-editor.module";
import { ApiService } from "./api/api.service";
import { AppComponent } from './app.component';
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MyOwnCustomMaterialModule,
    PatchEditorModule
  ],
  declarations: [
    AppComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [ConfirmDialogComponent],
  providers: [
    ApiService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, width: '450px' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
