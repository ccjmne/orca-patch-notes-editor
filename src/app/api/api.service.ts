import { Observable } from "rxjs/Observable";

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {
  private readonly apiUrl: String = 'https://5uazovpsbb.execute-api.eu-west-1.amazonaws.com/Prod';

  constructor(private http: HttpClient) { }

  listPatchNotes(version?: String): Observable<Object> {
    return this.http.get(`${this.apiUrl}/?version=${version || ''}&previous=true`);
    // .mergeMap((res: any): Array<any> => typeof (res === 'Array') ? res : [res]) // split into entries
    // .map((entry: any) => Object.assign(entry, { date: new Date(entry.timestamp) })) // enhance items
    // .reduce((acc, value) => { return acc.push(value), acc; }, []); // aggregate back into an array
  }

  getPatchNotes(version: String): Observable<Object> {
    return this.http.get(`${this.apiUrl}/${version}`);
  };
}
