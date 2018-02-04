import { Observable } from "rxjs/Observable";

import { Component, Inject } from '@angular/core';
import { Level, ApiEvent, ApiService } from "./api/api.service";
import { MatDialog, MatSnackBar } from '@angular/material';

import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

import '../assets/css/styles.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly patchNotes: Observable<Object> = this.api.patchNotes;

  constructor(
    @Inject(ApiService) private readonly api: ApiService,
    @Inject(MatDialog) private readonly dialog: MatDialog,
    @Inject(MatSnackBar) snackBar: MatSnackBar) {

    api.events.subscribe((event: ApiEvent) => {
      console.info(event);

      if (event.level !== Level.DEBUG) {
        snackBar.open(event.message, 'OK', { duration: 5000 });
      }
    });
  }

  save(version: string, contents: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        color: 'primary',
        title: 'Confirm update',
        confirmLabel: 'Update',
        contents: `<span class="text-primary">Update</span> patch notes for version <span class="text-primary">${version}</span>?`
      }
    }).afterClosed().filter((x: boolean) => x).subscribe(() => this.api.putPatchNotes(version, contents));
  }

  delete(version: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        color: 'warn',
        title: 'Confirm deletion',
        confirmLabel: 'Delete',
        contents: `<span class="text-warn">Delete</span> patch notes for version <span class="text-warn">${version}</span>?`
      }
    }).afterClosed().filter((x: boolean) => x).subscribe(() => this.api.deletePatchNotes(version));
  }
}
