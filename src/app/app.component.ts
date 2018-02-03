import { Observable } from "rxjs/Observable";

import { Component, Inject } from '@angular/core';
import { Level, ApiEvent, ApiService } from "./api/api.service";
import { MatSnackBar } from '@angular/material';

import '../assets/css/styles.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private readonly patchNotes: Observable<Object>;

  constructor(
    @Inject(ApiService) private readonly api: ApiService,
    @Inject(MatSnackBar) snackBar: MatSnackBar) {

    this.patchNotes = api.patchNotes;

    api.events.subscribe((event: ApiEvent) => {
      console.info(event);

      if (event.level !== Level.DEBUG) {
        snackBar.open(event.message, 'OK', { duration: 3000 });
      }
    });
  }

  refresh() {
    this.api.refreshPatchNotes();
  }

  tracker(patch: any) {
    return patch.version;
  }
}
