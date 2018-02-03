import { NgModule } from '@angular/core';

import { MyOwnCustomMaterialModule } from "../material/material.module";

import { ApiService } from "../api/api.service";

import { PatchEditorComponent } from "./patch-editor.component";

@NgModule({
  imports: [
    MyOwnCustomMaterialModule
  ],
  exports: [
    PatchEditorComponent
  ],
  declarations: [
    PatchEditorComponent
  ],
})
export class PatchEditorModule { }
