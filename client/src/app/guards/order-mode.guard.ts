import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderModeGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const user = this.userService.getUser();

    if (!user.myCart || user.myCart.cartItems.length === 0) {
      this.router.navigateByUrl('/shopping');

      return false;
    }

    return true;
  }
}
