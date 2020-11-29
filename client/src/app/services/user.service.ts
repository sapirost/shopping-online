import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private BASE_SERVICE_URL = 'users';

  jwtHelper: JwtHelperService = new JwtHelperService();
  refreshUserEvnt: EventEmitter<any> = new EventEmitter();
  userSubject = new BehaviorSubject<any>({ connect: false });
  userSubjectOBS = this.userSubject.asObservable();

  private endPoints = {
    GET_CONNECTED_USER: `/get-connected-member`,
    REGISTER: '/register',
    LOGIN: `/login`,
    LOGOUT: `/logout`,
    DELIVERY_USER_INFO: `/delivery-user-info`,
    CHECK_USER_ID: `/check-user`,
    USER_CART: (productId: string) => {
      return `/${productId}`;
    },
  };

  constructor(private http: HttpClient, private router: Router) {
    super();
  }

  addNewUser(userObj: any): any {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.REGISTER);

    return this.http.post(fullEndPoint, userObj)
      .pipe(
        map(
          (res: Response) => {
            this.userSubject.next(res);
          },
          error => {
            console.log('unable to register team member', error);
            this.userSubject.next({ connect: false });
          }
        )
      );
  }

  logUser(userObj: any): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.LOGIN);

    return this.http.post(fullEndPoint, userObj);
  }

  checkUserID(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.CHECK_USER_ID);
    return this.http.post(fullEndPoint, {});
  }

  // logUser(userObj: any): Observable<any> {
  //   return this.http.post(this.url + 'login', userObj);
  // }

  getUser(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.GET_CONNECTED_USER);
    return this.http.get(fullEndPoint);
  }

  getUserSubject(): any {
    return this.userSubjectOBS.subscribe(res => res);
  }

  userLogout(): void {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.LOGOUT);
    this.http.get(fullEndPoint);
    window.location.href = '/login';
    this.userSubject.next({ connect: false });
  }

  addToUserCart(productID: string, quantity: number): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.USER_CART(productID));
    return this.http.put(fullEndPoint, { quantity });
  }

  removeFromCart(productID: string): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.USER_CART(productID));
    return this.http.delete(fullEndPoint);
  }

  getUserDeliveryInfo(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.DELIVERY_USER_INFO);
    return this.http.get(fullEndPoint);
  }
}
