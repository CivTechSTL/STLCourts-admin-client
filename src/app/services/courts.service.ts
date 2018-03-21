import { Injectable, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Court} from '../models/court';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class CourtsService {
  courts: Court[];

  constructor(private http: HttpClient) {
  }

  public getAll(): Observable<Court[]> {
    return this.http
      .get(environment.baseUrl + '/courts')
      .map(response => {
        return <Array<Court>>response;
      });
  }

  public save(court: Court): Observable<Court> {
    return this.http
      .post(environment.baseUrl + '/courts', court )
      .map(response => {
        return <Court>response;
      });
  }

  public delete(id: any): void {
    this.http.delete(environment.baseUrl + '/courts/' + id).subscribe();
  }
}
