import { Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { Order } from '../models/order.model';
import { Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService extends BaseService {
  private BASE_SERVICE_URL = 'store';

  refreshProdsEm: EventEmitter<string> = new EventEmitter();
  editModeEvnt: EventEmitter<string> = new EventEmitter();

  private categoriesSubject = new Subject<Category[]>();
  categoriesObservable = this.categoriesSubject.asObservable();

  private endPoints = {
    ALL_PRODUCTS: '/all',
    GET_CATEGORIES: '/categories',
    GET_INFO: '/get-info',
    ADD_PRODUCT: `/`,
    GET_UNAVAILABLE_DATES: `/unavailable-dates`,
    SEND_ORDER: `/send-order`,
    FIND_PRODUCT: (searchWord: string) => {
      return `/by-name/${searchWord}`;
    },
    PRODUCT_BY_ID: (id: string) => {
      return `/${id}`;
    },
    PRODUCT_BY_CATEGORY: (id: string) => {
      return `/by-category-id/${id}`;
    },
    GET_PRODUCT_IMG: (image: string) => {
      return `/image/${image}`;
    },
  };

  constructor(private http: HttpClient) {
    super();
  }

  getAllCategories(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.GET_CATEGORIES);

    return this.http.get(fullEndPoint).pipe(
      map((results: any) => this.categoriesSubject.next(results)),
      catchError(err => throwError(err))
    );
  }

  addNewProduct(product: FormData): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.ADD_PRODUCT);
    return this.http.post(fullEndPoint, product);
  }

  getAllProducts(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.ALL_PRODUCTS);
    return this.http.get(fullEndPoint);
  }

  findProduct(searchText: string): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.FIND_PRODUCT(searchText));
    return this.http.get(fullEndPoint);
  }

  getInfo(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.GET_INFO);
    return this.http.get(fullEndPoint);
  }

  deleteProduct(id: string): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.PRODUCT_BY_ID(id));
    return this.http.delete(fullEndPoint);
  }

  getProductById(id: string): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.PRODUCT_BY_ID(id));
    return this.http.get(fullEndPoint);
  }

  updateProduct(id: string, product: FormData): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.PRODUCT_BY_ID(id));
    return this.http.put(fullEndPoint, product);
  }

  unavailableDates(): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.GET_UNAVAILABLE_DATES);
    return this.http.get(fullEndPoint);
  }

  sendOrder(order: Order): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.SEND_ORDER);
    return this.http.post(fullEndPoint, order);
  }

  getProductsByCategory(id: string): Observable<any> {
    const fullEndPoint = this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.PRODUCT_BY_CATEGORY(id));
    return this.http.get(fullEndPoint);
  }

  getProductImageLink(image: string): string {
    return this.buildFullEndPoint(this.BASE_SERVICE_URL, this.endPoints.GET_PRODUCT_IMG(image));
  }
}
