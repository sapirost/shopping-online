import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  usernameTitle: string;
  connect: boolean;
  role: string;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.refreshData(user);
    },
      err => {
        this.userService.userSubject.next({ connect: false });
        this.usernameTitle = 'Hello Guest';
        this.connect = false;
      });

    this.userService.refreshUserEvnt.subscribe(data => {
      this.refreshData(data);
    });
  }

  refreshData(data) {
    console.log("🚀 ~ file: app.component.ts ~ line 53 ~ AppComponent ~ refreshData ~ data", data)

    if (data.fail) {
      this.userService.userSubject.next({ connect: false });
      this.usernameTitle = 'Hello Guest';
      this.connect = false;
    } else {
      if (data.role === 'user' && (data.myCart.cart === null ||
        (data.myCart.cart !== null && data.myCart.cart.status === 'close'))) {
        data.myCart.cartItems = [];
      }
      this.userService.userSubject.next(data);
      this.usernameTitle = data.usernameMail;
      this.connect = true;
      this.role = data.role;

      if (data.role === 'admin') {
        this.usernameTitle = 'Hello Admin !';
      } else {
        this.usernameTitle = data.success;
      }
    }
  }

  logout() {
    // this.userService.userLogout().subscribe(data => {
    //   this.userService.userSubject.next({connect: false});
    //   this.usernameTitle = 'Hello Guest';
    //   this.connect = false;
    //   this.router.navigateByUrl('/login');
    // });

    this.userService.userLogout();
    this.usernameTitle = 'Hello Guest';
    this.connect = false;
    // this.router.navigateByUrl('/login');
  }
}
