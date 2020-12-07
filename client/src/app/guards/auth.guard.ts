import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { isNil, isEmpty } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private userService: UserService) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const user = this.userService.getUser();

    if (isEmpty(user)) {
      this.router.navigateByUrl('/login');

      return false;
    }

    return true;
  }

  canLoad(): boolean {
    const user = this.userService.getUser();

    if (isEmpty(user)) {
      this.router.navigateByUrl('/login');

      return false;
    }

    return true;
  }
}
