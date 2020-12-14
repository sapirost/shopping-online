import { User, UserRole } from './../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { StoreService } from './../../services/store.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  prodsAmount: number;
  ordersAmount: number;
  cartDate: string;
  lastOrder: string;
  openCart = false;
  user: User;

  constructor(private storeService: StoreService, private userService: UserService) { }

  ngOnInit() {
    this.getStoreInformation();

    this.user = this.userService.getUser();
    if (this.user && this.user.role === UserRole.client) {
      this.getUserCart();
    }
  }

  getUserCart() {
    this.userService.cartObservable.subscribe(cart => {
      this.openCart = cart && cart.status === 'open';
      this.cartDate = cart && cart.creationDate;
    });
  }

  getStoreInformation() {
    this.storeService.getInfo().subscribe(res => {
      this.prodsAmount = res.products;
      this.ordersAmount = res.orders;
    },
      err => console.error(err));
  }
}
