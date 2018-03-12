import { Injectable } from '@angular/core';
import {Court} from '../models/court';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ApiGoogleSignInService {

  constructor(private http: HttpClient) {
  }

  public googleSignIn(idToken: string): Observable<String> {
    return this.http
      .post(environment.baseUrl + '/googleSignin', {token: idToken} )
      .map(response => {
        return <String>response;
      });
  }

}
