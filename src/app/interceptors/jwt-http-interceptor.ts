import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { JwtService} from '../services/jwt.service';

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor{
  constructor(private jwtService: JwtService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {
    if (req.url.match('(.)*googleSignin(.)*')) {
      return next.handle(req);
    } else {
      const authToken = 'Bearer ' + this.jwtService.getToken();
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });

      const keys = authReq.headers.keys();
      for ( let i = 0; i < keys.length; i++) {
        console.log(keys[i]);
      }

      // const authReq = req.clone({ setHeaders: { Authorization: authToken } });
      // const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + this.jwtService.getToken())});
      return next.handle(authReq);
    }

  }

}
