import {Injectable, NgZone} from '@angular/core';
import {ApiGoogleSignInService} from '../services/api-google-sign-in.service';
import {JwtService} from '../services/jwt.service';
import {GoogleAuthService} from 'ng-gapi/lib/GoogleAuthService';
import {ApiPrivilegesService} from '../services/api-privileges.service';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import { Router } from '@angular/router';

import GoogleUser = gapi.auth2.GoogleUser;


import { User} from '../models/user';
import {MatDialog} from '@angular/material';

@Injectable()
export class UserService {
  private user: User;
  public redirectUrl: string;

  constructor(private googleAuthService: GoogleAuthService,
              private apiGoogleSignInService: ApiGoogleSignInService,
              private privilegeService: ApiPrivilegesService,
              private jwtService: JwtService,
              private ngZone: NgZone,
              private router: Router,
              public dialog: MatDialog) {
    this.user = new User();
  }

  public getCurrentUser(): User {
    return this.user;
  }

  public signIn() {
    this.googleAuthService.getAuth().subscribe((auth) => {
      auth.signIn().then(res => this.signInSuccessHandler(res), err => this.signInErrorHandler(err));
    });
  }

  public signOut(): void {
    this.googleAuthService.getAuth().subscribe((auth) => {
      try {
        auth.signOut();
        this.user.clearUserData();
        this.privilegeService.clearUserPrivilege();
        this.jwtService.clearTokens();
      } catch (e) {
        console.error(e);
      }

      this.router.navigate(['/']);
    });
  }

  public timedOut(): void {
    this.googleAuthService.getAuth().subscribe((auth) => {
      try {
        auth.signOut();
        this.user.clearUserData();
        this.privilegeService.clearUserPrivilege();
        this.jwtService.clearTokens();
      } catch (e) {
        console.error(e);
      }

      // present dialog to allow user to login again
      const dialogRef = this.dialog.open(LoginDialogComponent);

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.signIn();
        } else {
          this.router.navigate(['/']);
        }
      });
    });
  }

  private signInSuccessHandler(res: GoogleUser) {
    this.ngZone.run(() => {
      this.user.setGoogleUser(res);
      this.apiGoogleSignInService.googleSignIn(this.user.getUserGoogleToken()).subscribe(jwtResponse => {
        this.jwtService.setToken(jwtResponse['token']);
        this.jwtService.setRefreshToken(jwtResponse['refreshToken']);
        this.privilegeService.getUserPrivilege().subscribe(userRole => {
          this.user.setUserRole(userRole);
          this.user.setLoggedIn(true);
          if (this.redirectUrl) {
            const navigateToUrl = this.redirectUrl;
            this.redirectUrl = '';
            this.router.navigate([navigateToUrl]);
          }
        });
      });
    });
  }

  private signInErrorHandler(err) {
    console.warn(err);
    this.redirectUrl = '';
    this.router.navigate(['/']);
  }
}
