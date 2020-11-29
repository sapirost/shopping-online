import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.userService.getUserSubject();

    if (!user || !user.connect) {
      // this.router.navigateByUrl('/login');

      return false;
    }

    return true;
  }

  canLoad(): boolean {
    console.log("🚀 ~ file: auth.guard.ts ~ line 34 ~ AuthGuard ~ canLoad ~ canLoad")
    const user = this.userService.getUserSubject();

    if (!user || !user.connect) {
      // this.router.navigateByUrl('/login');

      return false;
    }

    return true;
  }
}
