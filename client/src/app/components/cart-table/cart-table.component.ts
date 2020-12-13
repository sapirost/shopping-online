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
  displayedColumns = ['name', 'quantity', 'price', 'remove'];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.cartObservable.subscribe(res => {
      if (this.router.url === '/payment') {
        this.orderMode = true;
        this.displayedColumns = ['name', 'quantity', 'price'];
      }

      if (res) {
        this.dataSource = new MatTableDataSource();
        this.dataSource.sort = this.sort;
        this.dataSource.data = res.items;
        this.totalPrice = res.items.map(t => t.price).reduce((acc, value) => acc + value, 0);
      }
    });
  }

  removeProd(product) {
    this.userService.removeFromCart(product.productID).subscribe(
      res => this.userService.updateUserCart(res),
      error => console.error('unable to register team member', error)
    );
  }

  payment() {
    this.router.navigateByUrl('/payment');
  }
}
