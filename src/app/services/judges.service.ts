import { Injectable, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Judge} from '../models/judge';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class JudgesService {
  judges: Judge[];

  constructor(private http: HttpClient) {
  }

  public delete(id: any): void {
    this.http.delete(environment.readBaseUrl + '/judges/' + id).subscribe();
  }
}
