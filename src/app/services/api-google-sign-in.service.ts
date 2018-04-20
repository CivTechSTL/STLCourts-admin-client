import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {TokenResponse} from '../models/tokenResponse';

@Injectable()
export class ApiGoogleSignInService {
  private loggedIn: boolean;
  private userName: string;
  private userImage: string;

  constructor(private http: HttpClient) {
    this.loggedIn = false;
    this.userName = '';
    this.userImage = '';
  }

  public googleSignIn(idToken: string): Observable<TokenResponse> {
    return this.http
      .post(environment.baseUrl + '/googleSignin', {token: idToken} )
      .map(response => {
        return <TokenResponse>response;
      });
  }
}
