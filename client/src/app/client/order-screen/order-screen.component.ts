import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { ReceiptPopupComponent } from '../popups/receipt-popup/receipt-popup.component';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-order-screen',
  templateUrl: './order-screen.component.html',
  styleUrls: ['./order-screen.component.scss']
})
export class OrderScreenComponent implements OnInit {
  minDate = new Date();
  cartToShip: any;
  totalPrice = 0;
  allDupedDates = [];

  shippingGroup: FormGroup = this.formBuilder.group({
    city: new FormControl('', [Validators.required]),
    street: new FormControl('', Validators.required),
    deliveryDate: new FormControl('', Validators.required),
    creditDigit: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
  });

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // tslint:disable-next-line:no-shadowed-variable
    const blockedDates = this.allDupedDates.map(d => d.valueOf());
    return (!blockedDates.includes(d.valueOf())) && day !== 6;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.storeService.unavailableDates().subscribe(data => {
      data.map(date => {
        this.allDupedDates.push(new Date(date));
      });
    });

    // Get cart to ship
    this.userService.userSubjectOBS.subscribe(data => {
      this.cartToShip = data.myCart;
      data.myCart.cartItems.map(c => {
        this.totalPrice += c.price;
      });
    });
  }

  backHome() {
    this.router.navigateByUrl('/shopping');
  }

  myInfo() {
    this.userService.getUserDeliveryInfo().subscribe(info => {
      if (info.deliveryInfo !== null) {
        this.shippingGroup = this.formBuilder.group({
          city: new FormControl(info.deliveryInfo.city, [Validators.required]),
          street: new FormControl(info.deliveryInfo.street, Validators.required),
          deliveryDate: new FormControl(this.shippingGroup.controls.deliveryDate.value, Validators.required),
          creditDigit: new FormControl(this.shippingGroup.controls.creditDigit.value, [Validators.required, Validators.pattern('^[0-9]*$')])
        });
      }
    });
  }

  sendToOrder() {
    const delivery = new Date(this.shippingGroup.value.deliveryDate).toDateString();
    const orderDetails = Object.assign(this.shippingGroup.value, this.cartToShip,
      { orderDate: this.minDate.toDateString() }, { totalPrice: this.totalPrice },
      { deliveryDate: delivery });
    this.storeService.sendOrder(orderDetails).subscribe(response => {
      if (response.msg === 'failed') {
        this.snackBar.open('something went wrong! please try again...');
      } else {
        this.openDialog();
        this.router.navigateByUrl('/shopping');
        this.userService.userSubject.next({ ...this.userService.userSubject.value, myCart: { cartItems: [] } });
      }
    },
      err => this.snackBar.open('something went wrong! please try again...'));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ReceiptPopupComponent, {
      width: '270px',
      data: { myCart: this.cartToShip.cartItems, totalPrice: this.totalPrice }
    });
  }
}
