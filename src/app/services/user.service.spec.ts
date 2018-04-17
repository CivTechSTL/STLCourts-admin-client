import {TestBed, getTestBed, fakeAsync, tick} from '@angular/core/testing';

import { UserService } from './user.service';
import {Router} from '@angular/router';
import {ApiGoogleSignInService} from './api-google-sign-in.service';
import {GoogleAuthService} from 'ng-gapi/lib/GoogleAuthService';
import {MatDialog} from '@angular/material';
import {JwtService} from './jwt.service';
import {ApiPrivilegesService} from './api-privileges.service';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';
import {UserRole} from '../models/userRole';


describe('UserService', () => {
    const mockGoogleProfile = {
      getName: function() { return 'myName'; },
      getImageUrl: function() { return 'myUrl'; }
    };

    const mockGoogleUser = {
      getBasicProfile: function() {
        return mockGoogleProfile;
      },
      getAuthResponse: function() {
        return { id_token: '123A' };
      }
    };

    const mockAuth = {
      signIn: function() { return Promise.resolve(mockGoogleUser); },
      signOut: function() {}
    };

    const mockGoogleAuthService = {
      getAuth: function() {
        return new Observable(observer => {
          observer.next(mockAuth);
        });
      }
    };

    const mockJwtResponse = {
      token: '123',
      refreshToken: '456'
    };

    const mockApiGoogleSignInService = {
      googleSignIn: function(val: string) {
        return new Observable(observer => {
          observer.next(mockJwtResponse);
        });
      }
    };

  /*  const mockUserRole = {
      role: 'someRole'
    };
*/
  const mockPrivilegeService = {
    getUserPrivilege: function() {
      return new Observable(observer => {
        observer.next(UserRole.ROLES.USER);
      });
    },
    clearUserPrivilege: function() {}
  };

    const mockJwtService = {
      setToken: function(token: string ) {},
      setRefreshToken: function( refreshToken: string ) {},
      clearTokens: function() {}
    };

  const mockMatDialogRefLogin = {
    afterClosed: function() {
      return new Observable(observer => {
        observer.next(true);
      });
    }
  };

  const mockMatDialogRefCancel = {
    afterClosed: function() {
      return new Observable(observer => {
        observer.next(false);
      });
    }
  };

  const mockRouter = { navigate: function() {} };
  const mockDialog = { open: function() {}, close: function() {} };

  let injector;
  let service: UserService;
  let jwtService: JwtService;
  let router: Router;
  let apiPrivilegeService: ApiPrivilegesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService,
        {provide: GoogleAuthService, useValue: mockGoogleAuthService},
        {provide: ApiGoogleSignInService, useValue: mockApiGoogleSignInService},
        {provide: ApiPrivilegesService, useValue: mockPrivilegeService},
        {provide: JwtService, useValue: mockJwtService},
        {provide: Router, useValue: mockRouter},
        {provide: MatDialog, useValue: mockDialog}]
    });

    injector = getTestBed();
    service = injector.get(UserService);
    jwtService = injector.get(JwtService);
    router = injector.get(Router);
    apiPrivilegeService = injector.get(ApiPrivilegesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it( 'signs in', fakeAsync(() => {
      spyOn(jwtService, 'setToken');
      spyOn(jwtService, 'setRefreshToken');
      spyOn(router, 'navigate');
      service.redirectUrl = 'someUrl';
      service.signIn();
      tick();

      expect(jwtService.setToken).toHaveBeenCalledWith('123');
      expect(jwtService.setRefreshToken).toHaveBeenCalledWith('456');
      const user: User = service.getCurrentUser();
      expect(user.isUserLoggedIn()).toBe(true);
      expect(user.getUserRole()).toEqual(UserRole.ROLES.USER);
      expect(router.navigate).toHaveBeenCalledWith(['someUrl']);
  }));

  it( 'signs in with err', fakeAsync(() => {
    spyOn(mockAuth, 'signIn').and.callFake( () => Promise.reject('bad') );
    spyOn(router, 'navigate');
    service.signIn();
    tick();

    const user: User = service.getCurrentUser();
    expect(user.isUserLoggedIn()).toBe(false);
    expect(service.redirectUrl).toEqual('');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it( 'signs out', () => {
    const user: User = service.getCurrentUser();
    spyOn(mockAuth, 'signOut');
    spyOn(user, 'clearUserData');
    spyOn(apiPrivilegeService, 'clearUserPrivilege');
    spyOn(jwtService, 'clearTokens');
    spyOn(router, 'navigate');

    service.signOut();
    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(user.clearUserData).toHaveBeenCalled();
    expect(apiPrivilegeService.clearUserPrivilege).toHaveBeenCalled();
    expect(jwtService.clearTokens).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it( 'times out and re-logs in', () => {
    const user: User = service.getCurrentUser();
    spyOn(mockAuth, 'signOut');
    spyOn(user, 'clearUserData');
    spyOn(apiPrivilegeService, 'clearUserPrivilege');
    spyOn(jwtService, 'clearTokens');
    spyOn(router, 'navigate');
    spyOn(service.dialog, 'open').and.callFake( () => {
      return mockMatDialogRefLogin;
    });
    spyOn(service, 'signIn');

    service.timedOut();
    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(user.clearUserData).toHaveBeenCalled();
    expect(apiPrivilegeService.clearUserPrivilege).toHaveBeenCalled();
    expect(jwtService.clearTokens).toHaveBeenCalled();

    expect(service.signIn).toHaveBeenCalled();
  });

  it( 'times out and does not re-login', () => {
    const user: User = service.getCurrentUser();
    spyOn(mockAuth, 'signOut');
    spyOn(user, 'clearUserData');
    spyOn(apiPrivilegeService, 'clearUserPrivilege');
    spyOn(jwtService, 'clearTokens');
    spyOn(router, 'navigate');
    spyOn(service.dialog, 'open').and.callFake( () => {
      return mockMatDialogRefCancel;
    });
    spyOn(service, 'signIn');

    service.timedOut();
    expect(mockAuth.signOut).toHaveBeenCalled();
    expect(user.clearUserData).toHaveBeenCalled();
    expect(apiPrivilegeService.clearUserPrivilege).toHaveBeenCalled();
    expect(jwtService.clearTokens).toHaveBeenCalled();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
