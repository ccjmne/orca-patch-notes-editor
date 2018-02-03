import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import * as SimpleMDE from 'simplemde';

import { ApiService } from "../api/api.service";

@Component({
  selector: 'patch-editor',
  templateUrl: './patch-editor.component.html',
  styleUrls: ['./patch-editor.component.scss']
})
export class PatchEditorComponent implements AfterViewInit {

  @Input() private version: string;
  @Input() private contents: string;

  @ViewChild('simplemde') textarea: ElementRef;
  private mde: SimpleMDE;

  constructor(private readonly api: ApiService) { }

  ngAfterViewInit() {
    this.mde = new SimpleMDE({
      element: this.textarea.nativeElement,
      toolbar: [
        ['heading-1', 'heading-2', 'heading-3'],
        ['bold', 'italic', 'strikethrough'],
        ['unordered-list', 'ordered-list'],
        ['link', 'image'],
        ['code', 'quote', 'table'],
        ['preview', 'guide']
      ].reduce((acc, cur) => acc.concat(...['|', cur])),
      spellChecker: false,
      status: false,
      autofocus: true
    });
  }

  save() {
    this.api.putPatchNotes(this.version, this.mde.value());
  }

  delete() {
    throw new Error('Not implemented yet');
  }
}
