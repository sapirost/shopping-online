import { Item } from './../../models/cart.model';
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
  dataSource: MatTableDataSource<Item>;
  totalPrice = 0;
  orderMode = false;
  displayedColumns = ['name', 'quantity', 'price'];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.orderMode = this.router.url === '/payment';

    // If not in order mode - table should include 'remove' option
    if (!this.orderMode) {
      this.displayedColumns.push('remove');
    }

    this.userService.cartObservable.subscribe(res => {
      if (res) {
        this.dataSource = new MatTableDataSource();
        this.dataSource.sort = this.sort;
        this.dataSource.data = res.items;
        this.totalPrice = res.items.map(t => t.price).reduce((acc, value) => acc + value, 0);
      }
    });
  }

  removeProd(product: Item) {
    this.userService.removeFromCart(product.productID).subscribe(
      res => this.userService.updateUserCart(res),
      error => console.error('unable to register team member', error)
    );
  }
}
