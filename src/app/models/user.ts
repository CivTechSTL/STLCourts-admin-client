import GoogleUser = gapi.auth2.GoogleUser;
import BasicProfile = gapi.auth2.BasicProfile;
import {UserRole} from './userRole';

export class User {
  private googleUser: GoogleUser = null;
  private profile: BasicProfile = null;
  private userRole: UserRole = null;
  private loggedIn = false;

  constructor() {}

  public setGoogleUser(googleUser: GoogleUser) {
    this.googleUser = googleUser;
    this.profile = this.googleUser.getBasicProfile();
  }

  public getUserName(): string {
    if (this.profile) {
      return this.profile.getName();
    } else {
      return '';
    }
  }

  public getUserImageUrl(): string {
    if (this.profile) {
      return this.profile.getImageUrl();
    } else {
      return '';
    }
  }

  public getUserGoogleToken(): string {
    if (this.googleUser) {
      return this.googleUser.getAuthResponse().id_token;
    } else {
      return '';
    }
  }

  public setUserRole(userRole: UserRole): void {
    this.userRole = userRole;
  }

  public getUserRole(): UserRole {
    return this.userRole;
  }

  public clearUserData(): void {
    this.googleUser = null;
    this.profile = null;
    this.userRole = null;
    this.loggedIn = false;
  }

  public setLoggedIn(loggedIn: boolean): void {
    this.loggedIn = loggedIn;
  }

  public isUserLoggedIn(): boolean {  // need to think through this
    return this.loggedIn;
  }

}

