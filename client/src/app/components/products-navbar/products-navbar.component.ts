import { Category } from './../../models/product.model';
import { Cart } from './../../models/cart.model';
import { isEmpty } from 'lodash';
import { UserRole } from './../../models/user.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-products-navbar',
  templateUrl: './products-navbar.component.html',
  styleUrls: ['./products-navbar.component.scss']
})
export class ProductsNavbarComponent implements OnInit {
  @ViewChild('drawer', { static: false }) public myNav: MatSidenav;
  allCategories: Category[];
  cartBadge = 0;
  role: UserRole;
  searchControl = new FormControl('');

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private storeService: StoreService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.storeService.categoriesObservable.subscribe(categories => this.allCategories = categories);
    this.subscribeFilterChanges();

    const user = this.userService.getUser();
    this.role = user.role;

    if (this.role === UserRole.client) {
      this.userService.cartObservable.subscribe(res => {
        if (res) {
          this.setCartBadge(res);
        }
      });
    }

    if (this.role === UserRole.admin) {
      this.subscribeEditModeChanges();
    }
  }

  subscribeEditModeChanges() {
    this.storeService.editModeEvnt.subscribe(() => this.myNav.open());
  }

  subscribeFilterChanges() {
    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(searchText => {
        if (isEmpty(searchText)) {
          this.storeService.getAllProducts().subscribe(products => this.storeService.refreshProdsEm.emit(products));
        } else {
          this.storeService.findProduct(searchText).subscribe(products => this.storeService.refreshProdsEm.emit(products));
        }
      });
  }

  setCartBadge(cart: Cart) {
    this.cartBadge = 0;
    cart.items.forEach(c => this.cartBadge += c.quantity);
  }

  // Event Emitter for changing the product's display
  changeCat(chosen) {
    if (chosen === 'all') {
      this.storeService.getAllProducts().subscribe(response => {
        this.storeService.refreshProdsEm.emit(response);
      });
    } else {
      this.storeService.getProductsByCategory(chosen).subscribe(response => {
        this.storeService.refreshProdsEm.emit(response);
      });
    }
  }
}
