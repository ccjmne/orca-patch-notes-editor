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

  private readonly patchNotes: Observable<Object> = this.api.patchNotes;

  constructor(
    @Inject(ApiService) private readonly api: ApiService,
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
}
