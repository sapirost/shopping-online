import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private BASE_SERVICE_URL = 'users';

  // jwtHelper: JwtHelperService = new JwtHelperService();
  private userSubject = new BehaviorSubject<any>({ connect: false });
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

  constructor(private http: HttpClient) {
    super();
  }

  addNewUser(userObj: any): any {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.REGISTER);

    return this.http.post(fullEndPoint, userObj);
  }

  logUser(userObj: any): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.LOGIN);

    return this.http.post(fullEndPoint, userObj);
  }


  checkUserID(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.CHECK_USER_ID);
    return this.http.post(fullEndPoint, {});
  }

  getUser(): any {
    return this.userSubject.getValue();
  }

  userLogout(): void {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.LOGOUT);
    this.http.get(fullEndPoint);

    this.userSubject.next({ connect: false });
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
