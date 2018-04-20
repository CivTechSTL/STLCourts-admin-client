import {async, TestBed, getTestBed} from '@angular/core/testing';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UserGuardService } from './user-guard.service';
import {UserService} from './user.service';

describe('UserGuardService', () => {
  let userRole: string;
  let loggedIn: boolean;

  const mockActivatedRouteSnapshot = {};
  const mockRouterStateSnapshot = {
    url: 'myUrl'
  };
  const mockUser = {
    isUserLoggedIn: function() { return loggedIn; },
    getUserRole: function() { return { role: userRole}; }
  };

  const mockUserService = {
    getCurrentUser: function() {return mockUser; },
    redirectUrl: ''
  };
  const mockRouter = {
    navigate: function() {}
  };

  let injector;
  let service: UserGuardService;
  let router: Router;
  let userService: UserService;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [UserGuardService,
        {provide: Router, useValue: mockRouter},
        {provide: UserService, useValue: mockUserService},
        {provide: ActivatedRouteSnapshot, useValue: mockActivatedRouteSnapshot},
        {provide: RouterStateSnapshot, useValue: mockRouterStateSnapshot}]
    });

    injector = getTestBed();
    service = injector.get(UserGuardService);
    router = injector.get(Router);
    userService = injector.get(UserService);
    route = TestBed.get(ActivatedRouteSnapshot);
    state = TestBed.get(RouterStateSnapshot);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loggedIn user: USER should be valid', async( () => {
        userRole = 'USER';
        loggedIn = true;
        spyOn(router, 'navigate');

        expect(service.canActivate(route, state)).toBe(true);
        expect(router.navigate).toHaveBeenCalledTimes(0);
      })
    );

  it('loggedIn user: ADMIN should be valid', async( () => {
      userRole = 'ADMIN';
      loggedIn = true;
      spyOn(router, 'navigate');
      expect(service.canActivate(route, state)).toBe(true);
      expect(router.navigate).toHaveBeenCalledTimes(0);
    })
  );

  it('loggedIn user: JUNK should be invalid', async( () => {
      userRole = 'JUNK';
      loggedIn = true;
      spyOn(router, 'navigate');
      spyOn(userService, 'redirectUrl');

      expect(service.canActivate(route, state)).toBe(false);
      const returnedUrl = userService.redirectUrl;
      expect(returnedUrl).toBe('myUrl');
      expect(router.navigate).toHaveBeenCalledTimes(1);
    })
  );
});

