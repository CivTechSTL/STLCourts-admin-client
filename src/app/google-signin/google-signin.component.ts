import {ChangeDetectorRef, AfterViewInit, Component, ElementRef, ViewChild, NgZone} from '@angular/core';
import {ApiGoogleSignInService} from '../services/api-google-sign-in.service';
import {JwtService} from '../services/jwt.service';
import {MatDialog} from '@angular/material';
import {LoggedInDialogComponent} from '../logged-in-dialog/logged-in-dialog.component';
import {ApiPrivilegesService} from '../services/api-privileges.service';

declare const gapi: any;

// for reference: https://stackoverflow.com/questions/31144874/gapi-is-not-defined-google-sign-in-issue-with-gapi-auth2-init

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn: ElementRef;

  private clientId = '586136797966-6gdr7aslkoa16l23klro33dkic52dpvp.apps.googleusercontent.com';

  private scope = [
    'profile',
    'email',
  ].join(' ');

  public auth2: any;
  loggedIn = false;
  loggedInImage: string;

  constructor(private element: ElementRef,
              private apiGoogleSignInService: ApiGoogleSignInService,
              private privilegeService: ApiPrivilegesService,
              private jwtService: JwtService,
              private cdRef: ChangeDetectorRef,
              public dialog: MatDialog,
              private _ngZone: NgZone) {
  }

  public googleInit() {
    const self = this;
    gapi.load('auth2', function () {
      self.auth2 = gapi.auth2.init({
        client_id: self.clientId,
        cookiepolicy: 'single_host_origin',
        scope: self.scope
      });
      self.attachSignin(self.googleBtn.nativeElement);
    });
  }
  public attachSignin(element) {
    const self = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        const profile = googleUser.getBasicProfile();
        const token = googleUser.getAuthResponse().id_token;
        self.apiGoogleSignInService.googleSignIn(token).subscribe(jwtResponse => {
          self.jwtService.setToken(jwtResponse['token']);
          self.jwtService.setRefreshToken(jwtResponse['refreshToken']);
          self.apiGoogleSignInService.setUserImage(profile.getImageUrl());
          self.apiGoogleSignInService.setUserName(profile.getName());

          self.privilegeService.getUserPrivilege().subscribe(userPrivilege => {
            self.apiGoogleSignInService.setLoggedIn(true);
            self.setLogin();
          });
        });
      }, function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  logOutDialogClicked(): void {
    let dialogRef: any;

    // see: https://github.com/angular/material2/issues/9676
    this._ngZone.run(() => {
      dialogRef = this.dialog.open(LoggedInDialogComponent, {
        minWidth: '250px',
      });

      dialogRef.updatePosition({ top: '0px', right: '0px' });
    });

    dialogRef.afterClosed().subscribe(logOut => {
      if (logOut.logOut) {
        this.googleSignOut();
      }
    },
      error => {
        console.log(error);
        this.googleSignOut();
      }
    );
  }

  public setLogin() {
    this.loggedIn = true;
    this.loggedInImage = this.apiGoogleSignInService.getUserImage();
    this.cdRef.detectChanges();
  }

  public googleSignOut() {
      const self = this;
      this.apiGoogleSignInService.clearUser();
      this.jwtService.clearTokens();
      this.loggedIn = false;
      this.cdRef.detectChanges();
      this.auth2.signOut().then(function () {
        // allow user to click sign in button again
        self.privilegeService.clearUserPrivilege();
        self.googleInit();
      });
  }

  ngAfterViewInit() {
     this.googleInit();
  }


}
