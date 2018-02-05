import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
  private readonly newPatch: any = {};
  private activePatch: string;

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

  tracker(patch: any) {
    return patch.version;
  }

  clearNewPatch() {
    Object.assign(this.newPatch, { version: null, contents: '' });
  }

  private readonly busyTrigger: BehaviorSubject<Observable<any>> = new BehaviorSubject(Observable.of(false));
  private readonly busy: Observable<boolean> = Observable.merge(this.busyTrigger.mapTo(true), this.busyTrigger.mergeMap(x => x.catch(() => Observable.of(false))).mapTo(false));

  save(version: string, contents: string, create?: boolean) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        color: 'primary',
        title: create ? 'Confirm creation' : 'Confirm update',
        confirmLabel: create ? 'Create' : 'Update',
        contents: `<span class="text-primary">${create ? 'Create' : 'Update'}</span> patch notes for version <span class="text-primary">${version}</span>?`
      }
    }).afterClosed().filter((x: boolean) => x).subscribe(() => {
      const put = this.api.putPatchNotes(version, contents);
      this.busyTrigger.next(put);
      if (create) {
        put.onErrorResumeNext().subscribe(() => { this.clearNewPatch(); this.activePatch = version })
      };
    });
  }

  delete(version: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        color: 'warn',
        title: 'Confirm deletion',
        confirmLabel: 'Delete',
        contents: `<span class="text-warn">Delete</span> patch notes for version <span class="text-warn">${version}</span>?`
      }
    }).afterClosed().filter((x: boolean) => x).subscribe(() => this.busyTrigger.next(this.api.deletePatchNotes(version)));
  }
}
