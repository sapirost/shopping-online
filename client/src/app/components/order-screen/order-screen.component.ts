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

  myFilter = (date: Date): boolean => {
    const day = date.getDay();
    const blockedDates = this.allDupedDates.map(d => d.valueOf());
    return (!blockedDates.includes(date.valueOf())) && day !== 6;
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
      data.forEach(date => this.allDupedDates.push(new Date(date)));
    });

    this.userService.cartObservable.subscribe(res => {
      this.cartToShip = res;

      if (res) {
        this.cartToShip.cartItems.forEach(item => this.totalPrice += item.price);
      }
    });
  }

  backHome() {
    this.router.navigateByUrl('/shopping');
  }

  myInfo() {
    console.log("🚀 ~ file: order-screen.component.ts ~ line 61 ~ OrderScreenComponent ~ myInfo ~ myInfo")
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
    const orderDetails = Object.assign(
      this.shippingGroup.value,
      this.cartToShip,
      { orderDate: this.minDate.toDateString() },
      { totalPrice: this.totalPrice },
      { deliveryDate: delivery }
    );

    this.storeService.sendOrder(orderDetails).subscribe(
      () => {
        this.openDialog();
        this.userService.updateUserCart(null);
        this.router.navigateByUrl('/shopping');
      },
      () => this.snackBar.open('something went wrong! please try again...'));
  }

  openDialog(): void {
    this.dialog.open(ReceiptPopupComponent, {
      width: '270px',
      data: { myCart: this.cartToShip.cartItems, totalPrice: this.totalPrice }
    });
  }
}
