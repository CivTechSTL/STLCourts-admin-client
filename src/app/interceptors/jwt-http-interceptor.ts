import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { JwtService } from '../services/jwt.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { ApiGoogleSignInService} from '../services/api-google-sign-in.service';


@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService,
              private refreshTokenService: RefreshTokenService,
              private googleSignInService: ApiGoogleSignInService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const self = this;

    return new Observable<HttpEvent<any>>(subscriber => {
      // first try for the request
      if (!(req.url.match('(.)*googleSignin(.)*') && req.url.match( '(.)*refreshToken(.)*'))) {
        req = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + this.jwtService.getToken())
        });
      }
      next.handle(req)
        .subscribe((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // the request went well and we have valid response
            // give response to user and complete the subscription
            subscriber.next(event);
            subscriber.complete();
          }
        },
          error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              console.log('401 error, trying to re-login');

              // try to re-log the user
              this.refreshTokenService.refreshToken().subscribe(jwtResponse => {
                self.jwtService.setToken(jwtResponse['token']);
                self.jwtService.setRefreshToken(jwtResponse['refreshToken']);
                // re-login successful -> create new headers with the new auth token
                const newRequest = req.clone({
                  headers: req.headers.set('Authorization', 'Bearer ' + jwtResponse['token'])
                });

                // retry the request with the new token
                next.handle(newRequest)
                  .subscribe(newEvent => {
                    if (newEvent instanceof HttpResponse) {
                      // the second try went well and we have valid response
                      // give response to user and complete the subscription
                      subscriber.next(newEvent);
                      subscriber.complete();
                    }
                  }, err => {
                    // second try went wrong -> throw error to subscriber
                    subscriber.error(err);
                  });
              });
            } else {
              // the error was not related to auth token -> throw error to subscriber
              subscriber.error(error);
            }
          });
    });
  }
}
