import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { JwtService } from '../services/jwt.service';
import { RefreshTokenService } from '../services/refresh-token.service';

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService, private refreshTokenService: RefreshTokenService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>(subscriber => {
      // first try for the request
      if (!(req.url.match('(.)*googleSignin(.)*') || req.url.match( '(.)*refreshToken(.)*'))) {
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
              this.reLogin().subscribe(authToken => {
                // re-login successful -> create new headers with the new auth token
                const newRequest = req.clone({
                  headers: req.headers.set('Authorization', authToken)
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

  /**
   * Try to re-login the user.
   */
  private reLogin(): Observable<string> {
    // obtain new authorization token and return it
    const self = this;
    return new Observable<string>( subscriber => {
      console.log('Refreshing Tokens');
      self.refreshTokenService.refreshToken().subscribe(jwtResponse => {
        self.jwtService.setToken(jwtResponse['token']);
        self.jwtService.setRefreshToken(jwtResponse['refreshToken']);
      });
      subscriber.next(self.jwtService.getToken());
    });
  }

 /*
  intercept(req: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {
    if (req.url.match('(.)*googleSignin(.)*')) {
      return next.handle(req);
    } else {
      if (req.url.match( '(.)*refreshToken(.)*')) {
        return next.handle(req);
      } else {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.jwtService.getToken())
      });

      return next.handle(authReq);
      }
    }

  }
  */

}
