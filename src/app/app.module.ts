import './rxjs/rxjs.module';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MyOwnCustomMaterialModule } from "./material/material.module";

import { ApiService } from "./api/api.service";

import { AppComponent } from './app.component';
import { PatchEditorComponent } from "./patch-editor/patch-editor.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MyOwnCustomMaterialModule
  ],
  declarations: [
    AppComponent,
    PatchEditorComponent
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
