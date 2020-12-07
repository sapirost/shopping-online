import { User } from './../models/user.model';
import { isEmpty } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private BASE_SERVICE_URL = 'users';

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private userSubject = new BehaviorSubject<User | null>(null);
  userObservable = this.userSubject.asObservable();

  private cartSubject = new BehaviorSubject<any>(null);
  cartObservable = this.cartSubject.asObservable();

  private endPoints = {
    REGISTER: '/register',
    LOGIN: `/login`,
    DELIVERY_USER_INFO: `/delivery-user-info`,
    CHECK_USER_ID: `/check-user`,
    USER_CART: `/cart`,
    UPDATE_CART: (productId: string) => {
      return `/${productId}`;
    },
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    super();
  }

  addNewUser(user: User): Observable<User> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.REGISTER);

    return this.http.post(fullEndPoint, user).pipe(
      map(
        (results: any) => {
          localStorage.setItem('token', results.token);
          const decodedUser = this.getDecodedToken();
          this.updateUser(decodedUser);
          return decodedUser;
        },
        err => {
          const errMessage = err.error === 'Unauthorized' ? 'user does not exist' : 'something went wrong, please try again';
          this.snackBar.open(errMessage);
        })
    );
  }

  logUser(user: User): Observable<User> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.LOGIN);

    return this.http.post(fullEndPoint, user).pipe(
      map(
        (results: any) => {
          localStorage.setItem('token', results.token);
          const decodedUser = this.getDecodedToken();
          this.updateUser(decodedUser);
          return decodedUser;
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

  getUser(): User {
    const user = this.userSubject.getValue();

    if (isEmpty(user)) {
      const decodedUser = this.getDecodedToken();
      this.updateUser(decodedUser);
      return decodedUser;
    }

    return user;
  }

  getUserCart(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.USER_CART);
    const cart = this.cartSubject.getValue();

    return cart ? of(cart) : this.http.get(fullEndPoint).pipe(
      map(
        results => {
          this.cartSubject.next(results);
          return results;
        })
    );
  }

  updateUserCart(cart: any): any {
    this.cartSubject.next({ cart });
  }

  getDecodedToken(): User {
    const token = this.getToken();

    return token && this.jwtHelper.decodeToken(token);
  }

  getToken(): string {
    const token = localStorage.getItem('token');

    if (this.jwtHelper.isTokenExpired(token)) {
      localStorage.removeItem('token');

      return null;
    }

    return token;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  addToUserCart(productID: string, quantity: number): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.UPDATE_CART(productID));
    return this.http.put(fullEndPoint, { quantity });
  }

  removeFromCart(productID: string): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.UPDATE_CART(productID));
    // return this.http.delete(fullEndPoint);

    return this.http.delete(fullEndPoint)
      .pipe(
        map(
          res => this.updateUserCart(res),
          error => console.error('unable to register team member', error)
        )
      );
  }

  updateUser(user: User) {
    this.userSubject.next(user);
  }

  getUserDeliveryInfo(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.DELIVERY_USER_INFO);
    return this.http.get(fullEndPoint);
  }
}
