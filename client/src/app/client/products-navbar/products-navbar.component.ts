import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  searchGroup: FormGroup;
  allCategories: [] = [];
  cartBadge = 0;
  role: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.searchGroup = this.formBuilder.group({
      searchText: ['']
    });

    // Getting all categories from server
    this.storeService.getAllCategories().subscribe(categoriesData => {
      this.allCategories = categoriesData;
    });

    // A server call to check if product exist
    this.searchGroup.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(val => {
        if (val.searchText === '') {
          this.storeService.getAllProducts().subscribe(response => {
            this.storeService.refreshProdsEm.emit(response);
          });
        } else {
          this.storeService.findProduct(val).subscribe(results => {
            this.storeService.refreshProdsEm.emit(results);
          });
        }
      });

    // Update products amount in cart
    this.userService.userSubjectOBS.subscribe(data => {
      this.role = data.role;
      if (data.role === 'user') {
        this.cartBadge = 0;
        data.myCart.cartItems.map(c => {
          this.cartBadge += c.quantity;
        });
      }
    });

    // Apply edit mode
    this.storeService.editModeEvnt.subscribe(data => {
      this.myNav.open();
    });
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
