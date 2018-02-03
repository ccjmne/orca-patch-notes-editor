import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export enum Level {
  DEBUG = 'debug',
  INFO = 'info',
  ERROR = 'error'
}

export class ApiEvent {

  constructor(readonly message: string, readonly level: Level = Level.INFO) { }

  static fromHTTPResponse(response: any): ApiEvent {
    if (response.error) {
      return new ApiEvent(response.error.message, Level.ERROR);
    }

    return new ApiEvent(response.body);
  }
}

class DebugApiEvent extends ApiEvent {

  constructor(message: string);
  constructor(source: ApiEvent);
  constructor(source: string | ApiEvent) {
    super(source instanceof ApiEvent ? source.message : source, Level.DEBUG);
  }
}

@Injectable()
export class ApiService {

  private static readonly API_URL: string = 'https://wfhqpe4fok.execute-api.eu-west-1.amazonaws.com/Prod';

  private readonly debug: Subject<any> = new Subject();
  private readonly requests: Subject<any> = new Subject();
  readonly events: Observable<ApiEvent> = Observable.merge(
    this.debug.map(v => new DebugApiEvent(v)),
    this.requests.mergeMap(x => x.catch((err: Error) => Observable.of(ApiEvent.fromHTTPResponse(err))))
  ).map((v: any) => v instanceof ApiEvent ? v : new ApiEvent(v));

  constructor(private readonly http: HttpClient) { }

  private logRequest(req: Observable<any>, successMessage: string | ApiEvent, debugMessage?: string | ApiEvent) {
    if (debugMessage) { this.debug.next(debugMessage); }
    return this.requests.next(req.mapTo(successMessage)), req;
  }

  listPatchNotes(version?: string): Observable<Object> {
    return this.http.get(`${ApiService.API_URL}/?version=${version || ''}&previous=true`);
  }

  getPatchNotes(version: string): Observable<Object> {
    return this.http.get(`${ApiService.API_URL}/${version}`);
  };

  putPatchNotes(version: string, body: string): Observable<Object> {
    return this.logRequest(this.http.put(`${ApiService.API_URL}/${version}`, body), `Patch notes saved for version: ${version}`, `Saving patch notes for version: ${version}...`);
  }
}
