import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import * as SimpleMDE from 'simplemde';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {

  @Input() private contents: String;

  @ViewChild('simplemde') textarea: ElementRef;
  private mde: SimpleMDE;

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
    throw 'Not implemented yet';
  }
}
