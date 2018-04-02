import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ApiGoogleSignInService} from '../services/api-google-sign-in.service';
import {JwtService} from '../services/jwt.service';
declare const gapi: any;

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.scss']
})
export class GoogleSigninComponent implements AfterViewInit {

  private clientId = '586136797966-6gdr7aslkoa16l23klro33dkic52dpvp.apps.googleusercontent.com';

  private scope = [
    'profile',
    'email',
  ].join(' ');

  public auth2: any;

  constructor(private element: ElementRef, private apiGoogleSignInService: ApiGoogleSignInService, private jwtService: JwtService) {
    // console.log('In constructor, ElementRef: ', this.element);
  }

  public googleInit() {
    // console.log('In google init');
    const self = this;
    gapi.load('auth2', function () {
      // console.log('In gapi.load');
      self.auth2 = gapi.auth2.init({
        client_id: self.clientId,
        cookiepolicy: 'single_host_origin',
        scope: self.scope
      });
      self.attachSignin(self.element.nativeElement.firstChild);
    });
  }
  public attachSignin(element) {
    // console.log('In Attach Sign in');
    const self = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        const profile = googleUser.getBasicProfile();
        const token = googleUser.getAuthResponse().id_token;
       // console.log('Token || ' + token);
       // console.log('ID: ' + profile.getId());
       // console.log('Name: ' + profile.getName());
       // console.log('Image URL: ' + profile.getImageUrl());
       // console.log('Email: ' + profile.getEmail());
        // YOUR CODE HERE
        self.apiGoogleSignInService.googleSignIn(token).subscribe(jwtResponse => {
          self.jwtService.setToken(jwtResponse['token']);
          self.jwtService.setRefreshToken(jwtResponse['refreshToken']);
          }
        );
        // self.apiGoogleSignInService.googleSignIn(token).subscribe(jwtToken => console.log('JWT Token: ' + jwtToken));


      }, function (error) {
        console.log('In error');
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  ngAfterViewInit() {
    // console.log('In ngAfterViewInit');
    this.googleInit();
  }

}
