import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
import { Subject } from "rxjs/Subject";

import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiEvent, DebugApiEvent, Level } from "./apievent";

export { ApiEvent, Level };

@Injectable()
export class ApiService {

  private static readonly API_URL: string = 'https://wfhqpe4fok.execute-api.eu-west-1.amazonaws.com/Prod';

  /* ------------------------------------------------------------------------- *
   * Event stream
   * ------------------------------------------------------------------------- */
  private readonly debug: Subject<any> = new Subject();
  private readonly requests: Subject<any> = new Subject();
  readonly events: Observable<ApiEvent> = Observable.merge(
    this.debug.map((v: ApiEvent) => new DebugApiEvent(v)),
    this.requests.mergeMap((x: Observable<any>) => x.catch((err: Error) => Observable.of(ApiEvent.fromHTTPResponse(err))))
  ).map((v: any) => v instanceof ApiEvent ? v : new ApiEvent(v));

  private logRequest(req: Observable<any>, successMessage: string | ApiEvent, debugMessage?: string | ApiEvent): Observable<any> {
    if (debugMessage) { this.debug.next(debugMessage); }
    const res = req.multicast(new Subject());
    return res.connect() && this.requests.next(res.mapTo(successMessage)), res;
  }


  /* ------------------------------------------------------------------------- *
   * Patch notes stream
   * ------------------------------------------------------------------------- */
  private readonly refreshAll: Subject<any> = new Subject();
  private readonly patchNotesStream: ConnectableObservable<Object> = this.refreshAll
    .startWith('')
    .mergeMap(() => this.logRequest(this.http.get(`${ApiService.API_URL}/?version=${''}&previous=true`), new DebugApiEvent('Patch notes refreshed'), 'Refreshing patch notes...'))
    .multicast(new Subject());

  get patchNotes(): Observable<Object> {
    return this.patchNotesStream.connect() && this.patchNotesStream;
  }


  constructor(
    @Inject(HttpClient) private readonly http: HttpClient) { }


  /* ------------------------------------------------------------------------- *
   * API
   * ------------------------------------------------------------------------- */

  refreshPatchNotes() {
    this.refreshAll.next();
  }

  getPatchNotes(version: string): Observable<Object> {
    return this.http.get(`${ApiService.API_URL}/${version}`);
  };

  putPatchNotes(version: string, body: string): Observable<Object> {
    const res = this.logRequest(this.http.put(`${ApiService.API_URL}/${version}`, body), `Saved patch notes for version: ${version}`, `Saving patch notes for version: ${version}...`)
    res.subscribe(() => this.refreshPatchNotes());
    return res;
  }

  deletePatchNotes(version: string): Observable<Object> {
    const res = this.logRequest(this.http.delete(`${ApiService.API_URL}/${version}`), `Deleted Patch notes for version: ${version}`, `Deleting patch notes for version: ${version}...`)
    res.subscribe(() => this.refreshPatchNotes());
    return res;
  }
}
