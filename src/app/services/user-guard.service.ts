import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {UserRole} from '../models/userRole';

@Injectable()
export class UserGuardService implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;

    if (this.userService.getCurrentUser().isUserLoggedIn()  &&
      UserRole.allowedRoles.includes(this.userService.getCurrentUser().getUserRole().role)) {
      // (UserRole.allowedRoles.indexOf(this.userService.getCurrentUser().getUserRole().role) !== -1)) {
      return true;
    } else {
      this.userService.redirectUrl = url;
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
