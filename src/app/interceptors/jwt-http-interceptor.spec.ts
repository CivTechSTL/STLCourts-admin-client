import {TestBed, inject, getTestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {JwtHttpInterceptor} from './jwt-http-interceptor';
import {JwtService} from '../services/jwt.service';
import {RefreshTokenService} from '../services/refresh-token.service';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TokenResponse} from "../models/tokenResponse";




describe('JwtHttpInterceptor', () => {
  const mockJwtService = {
    setToken: function(token: string ) {},
    setRefreshToken: function( refreshToken: string ) {},
    getToken: function() {}
  };

  const mockRefreshTokenService = {
    refreshToken: function() {
      return new Observable(observer => {
        observer.next({token: '123', refreshToken: '456'});
      });
    }
  };

  const mockUserService = {
    signedOut: function() {},
    timedOut: function() {}
  };

  let injector;
  let interceptor: JwtHttpInterceptor;
  let userService: UserService;
  let refreshTokenService: RefreshTokenService;
  let jwtService: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JwtHttpInterceptor,
        {provide: JwtService, useValue: mockJwtService},
        {provide: RefreshTokenService, useValue: mockRefreshTokenService},
        {provide: UserService, useValue: mockUserService},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtHttpInterceptor,
          multi: true
        }]
    });

    injector = getTestBed();
    interceptor = injector.get(JwtHttpInterceptor);
    userService = injector.get(UserService);
    refreshTokenService = injector.get(RefreshTokenService);
    jwtService = injector.get(JwtService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('it should not add headers',
    inject( [HttpClient, HttpTestingController], (httpClient: HttpClient, httpMock: HttpTestingController) => {

    const tokenResponse: TokenResponse = {token: '123', refreshToken: '456'};
    const url: string = environment.baseUrl + '/googleSignin';
    httpClient.post<TokenResponse>(url, {token: 'abc'})
      .subscribe(response => {
          expect(response).toEqual(tokenResponse);
        }
      );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.has('Authorization')).toBe(false);

      req.flush(tokenResponse);

      // assert that there are no outstanding requests.
      httpMock.verify();

  }));

  it('it should not add headers',
    inject( [HttpClient, HttpTestingController], (httpClient: HttpClient, httpMock: HttpTestingController) => {

      const tokenResponse: TokenResponse = {token: '123', refreshToken: '456'};
      const url: string = environment.baseUrl + '/refreshToken';
      httpClient.post<TokenResponse>(url, {token: 'abc'})
        .subscribe(response => {
            expect(response).toEqual(tokenResponse);
          }
        );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.has('Authorization')).toBe(false);

      req.flush(tokenResponse);

      // assert that there are no outstanding requests.
      httpMock.verify();

    }));

  it('it should add headers',
    inject( [HttpClient, HttpTestingController], (httpClient: HttpClient, httpMock: HttpTestingController) => {

      const url: string = environment.baseUrl + '/somethingElse';
      httpClient.get<TokenResponse>(url)
        .subscribe(response => {
          }
        );

      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.has('Authorization')).toBe(true);
      req.flush('');

      // assert that there are no outstanding requests.
      httpMock.verify();

    }));
});
