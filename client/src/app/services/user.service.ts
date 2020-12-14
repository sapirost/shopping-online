import { User } from './../models/user.model';
import { isEmpty } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base-service';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private BASE_SERVICE_URL = 'users';

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private userSubject = new BehaviorSubject<User | null>(null);
  userObservable = this.userSubject.asObservable();

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cartObservable = this.cartSubject.asObservable();

  private endPoints = {
    REGISTER: '/register',
    LOGIN: `/login`,
    DELIVERY_USER_INFO: `/delivery-user-info`,
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

  logUser(user: User): Observable<void> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.LOGIN);

    return this.http.post(fullEndPoint, user).pipe(
      map(
        (results: any) => {
          localStorage.setItem('token', results.token);
          const decodedUser = this.getDecodedToken();
          this.updateUser(decodedUser);
        }),
      catchError(err => {
        const errMessage = err.status === 401 ? 'user does not exist' : 'something went wrong, please try again';
        this.snackBar.open(errMessage);

        return throwError(err);
      })
    );
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

  getUserCart(): Cart {
    return this.cartSubject.getValue();
  }

  retrieveUserCart(): Observable<Cart | void> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.USER_CART);

    return this.http.get(fullEndPoint).pipe(
      map((results: Cart) => this.cartSubject.next(results),
        err => console.error(err))
    );
  }

  updateUserCart(cart: Cart): void {
    this.cartSubject.next(cart);
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
    return this.http.delete(fullEndPoint);
  }

  updateUser(user: User) {
    this.userSubject.next(user);
  }

  getUserDeliveryInfo(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.DELIVERY_USER_INFO);
    return this.http.get(fullEndPoint);
  }
}
