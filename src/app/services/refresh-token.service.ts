import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TokenResponse} from '../models/tokenResponse';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {JwtService} from './jwt.service';

@Injectable()
export class RefreshTokenService {

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  public refreshToken(): Observable<TokenResponse> {
    return this.http
      .post(environment.baseUrl + '/refreshToken', {token: this.jwtService.getRefreshToken()} )
      .map(response => {
        return <TokenResponse>response;
      });
  }

}
