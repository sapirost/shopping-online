import { User } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  prodsAmount: number;
  ordersAmount: number;
  cartDate: any;
  lastOrder: any;
  openCart = false;
  user: User;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    const user = this.userService.getUser();
    this.setData(user);

    this.userService.userObservable.subscribe(res => this.setData(res));
  }

  setData(user: User) {
    this.user = user;

    if (user && user.role === 'user') {
      this.getCart();
    }
  }

  getCart() {
    this.storeService.getInfo().subscribe(data => {
      this.prodsAmount = data.products;
      this.ordersAmount = data.orders;

      if (data.status === 'close') {
        this.lastOrder = data.lastOrder;
      }

      if (data.status === 'open') {
        this.openCart = true;
        this.cartDate = data.creationDate;
      }
    },
      err => console.error(err));
  }
}
