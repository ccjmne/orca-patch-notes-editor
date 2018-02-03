import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import * as SimpleMDE from 'simplemde';

import { ApiService } from "../api/api.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'patch-editor',
  templateUrl: './patch-editor.component.html',
  styleUrls: ['./patch-editor.component.scss']
})
export class PatchEditorComponent implements AfterViewInit, OnChanges {

  @Input() private readonly version: string;
  @Input() private readonly contents: string;
  @Output() contentsChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('simplemde') textarea: ElementRef;
  private mde: SimpleMDE;

  constructor(
    @Inject(ApiService) private readonly api: ApiService,
    @Inject(MatDialog) private readonly dialog: MatDialog) { }

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
      autofocus: true,
      initialValue: this.contents
    });

    this.mde.codemirror.on('change', () => {
      this.contentsChange.emit(this.mde.value());
    });
  }

  save() {
    this.api.putPatchNotes(this.version, this.mde.value());
  }

  delete() {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        color: 'warn',
        contents: `<span class="text-warn">Delete</span> patch notes for version: <span class="text-warn">${this.version}</span>?`
      }
    }).afterClosed().filter((x: boolean) => x).subscribe(() => this.api.deletePatchNotes(this.version));
  }

  ngOnChanges(changes: any) {
    if (this.mde && changes.contents.currentValue !== this.mde.value()) {
      this.mde.value(changes.contents.currentValue);
    }
  }
}
