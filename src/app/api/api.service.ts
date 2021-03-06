import { Observable } from "rxjs/Observable";
import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

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
    return this.requests.next(req.mapTo(successMessage)), req;
  }


  /* ------------------------------------------------------------------------- *
   * Patch notes stream
   * ------------------------------------------------------------------------- */
  private readonly refreshAll: Subject<any> = new BehaviorSubject(null);
  readonly patchNotes: Observable<Object> = this.refreshAll
    .mergeMap(() => this.logRequest(this.http.get(`${ApiService.API_URL}/?version=${''}&previous=true`).share(), new DebugApiEvent('Patch notes refreshed'), 'Refreshing patch notes...'));


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
    const res = this.logRequest(this.http.put(`${ApiService.API_URL}/${version}`, body).share(), `Saved patch notes for version number: ${version}`, `Saving patch notes for version number: ${version}...`)
    res.onErrorResumeNext().subscribe(() => this.refreshPatchNotes());
    return res;
  }

  deletePatchNotes(version: string): Observable<Object> {
    const res = this.logRequest(this.http.delete(`${ApiService.API_URL}/${version}`).share(), `Deleted Patch notes for version number: ${version}`, `Deleting patch notes for version number: ${version}...`)
    res.onErrorResumeNext().subscribe(() => this.refreshPatchNotes());
    return res;
  }
}
