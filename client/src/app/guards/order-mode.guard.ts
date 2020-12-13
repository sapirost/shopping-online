import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './../services/user.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderModeGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const cart = this.userService.getUserCart();
    if (!cart || cart.items.length === 0) {
      this.router.navigateByUrl('/shopping');

      return false;
    }

    return true;
  }
}
