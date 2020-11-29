import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderModeGuard implements CanActivate {
  orderMode = false;

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.userService.userSubjectOBS.subscribe(value => {
        if (value.myCart !== undefined && value.myCart.cartItems.length > 0) {
          this.orderMode = true;
          resolve(true);
        } else {
          this.router.navigateByUrl('/shopping');
        }
        return this.orderMode;
      });
    });
  }
}
