import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.scss']
})
export class CartTableComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  totalPrice = 0;
  orderMode = false;
  displayedColumns = ['name', 'quantity', 'price', 'customColumn1'];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.userSubjectOBS.subscribe(data => {
      if (this.router.url === '/payment') {
        this.orderMode = true;
        this.displayedColumns = ['name', 'quantity', 'price'];
      }

      this.dataSource = new MatTableDataSource();
      this.dataSource.sort = this.sort;
      this.dataSource.data = data.myCart.cartItems;
      this.totalPrice = data.myCart.cartItems.map(t => t.price).reduce((acc, value) => acc + value, 0);
    });
  }

  removeProd(product) {
    this.userService.removeFromCart(product.productID).subscribe(data => {
      this.userService.userSubject.next({ ...this.userService.userSubject.value, myCart: data });
    });
  }

  payment() {
    this.router.navigateByUrl('/payment');
  }
}
