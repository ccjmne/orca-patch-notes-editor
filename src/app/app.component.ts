import { Observable } from "rxjs/Observable";

import { Component } from '@angular/core';
import { ApiService } from "./api/api.service";

import '../assets/css/styles.scss';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly patchNotes: Observable<Object>;

  constructor(api: ApiService) {
    this.patchNotes = api.getPatchNotes();
  }
}
