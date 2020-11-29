import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  connect = false;
  role: string;

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.refreshData();

    this.userService.userSubjectOBS.subscribe(data => {
      this.connect = data.connect;
      if (data.connect) {
        this.role = data.role;
      }
      this.refreshData();
    });
  }

  refreshData() {
    this.storeService.getInfo().subscribe(data => {
      this.prodsAmount = data.products;
      this.ordersAmount = data.orders;
      if (data.cartStatus) {
        switch (data.cartStatus) {
          case 'open':
            this.openCart = true;
            this.cartDate = data.myCart[0].creationDate;
            break;
          case 'close':
            this.lastOrder = data.lastOrder;
            break;
        }
      }
    });
  }

  routing() {
    this.router.navigateByUrl('/shopping');
  }
}
