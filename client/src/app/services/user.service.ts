import { isEmpty } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
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
  private userSubject = new BehaviorSubject<any>({ });
  userObservable = this.userSubject.asObservable();

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

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    super();
  }

  addNewUser(userObj: any): any {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.REGISTER);

    return this.http.post(fullEndPoint, userObj).pipe(
      map(
        (results: any) => {
          localStorage.setItem('token', results.token);
          const user = this.getDecodedToken();
          this.updateUser(user);
          return user;
        },
        err => {
          const errMessage = err.error === 'Unauthorized' ? 'user does not exist' : 'something went wrong, please try again';
          this.snackBar.open(errMessage);
        })
    );
  }

  logUser(userObj: any): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.LOGIN);

    return this.http.post(fullEndPoint, userObj).pipe(
      map(
        (results: any) => {
          localStorage.setItem('token', results.token);
          const user = this.getDecodedToken();
          this.updateUser(user);
          return user;
        },
        err => {
          const errMessage = err.error === 'Unauthorized' ? 'user does not exist' : 'something went wrong, please try again';
          this.snackBar.open(errMessage);
        })
    );
  }


  checkUserID(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.CHECK_USER_ID);
    return this.http.post(fullEndPoint, {});
  }

  getUser(): any {
    const user = this.userSubject.getValue();

    if (isEmpty(user)) {
      const decodedUser = this.getDecodedToken();
      this.updateUser(decodedUser);
      return decodedUser;
    }

    return user;
  }

  getDecodedToken() {
    const token = localStorage.getItem('token');

    if (this.jwtHelper.isTokenExpired(token)) {
      localStorage.removeItem('token');

      return null;
    }

    return this.jwtHelper.decodeToken(token);
  }

  userLogout(): void {
    localStorage.removeItem('token');
    this.userSubject.next({ });
  }

  addToUserCart(productID: string, quantity: number): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.USER_CART(productID));
    return this.http.put(fullEndPoint, { quantity });
  }

  removeFromCart(productID: string): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.USER_CART(productID));
    // return this.http.delete(fullEndPoint);

    return this.http.delete(fullEndPoint)
      .pipe(
        map(
          res => this.updateUserCart(res),
          error => console.error('unable to register team member', error)
        )
      );
  }

  updateUser(user: any) {
    this.userSubject.next(user);
  }

  updateUserCart(cart: any) {
    this.userSubject.next({ ...this.getUser(), myCart: cart });
  }

  getUserDeliveryInfo(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.DELIVERY_USER_INFO);
    return this.http.get(fullEndPoint);
  }
}
