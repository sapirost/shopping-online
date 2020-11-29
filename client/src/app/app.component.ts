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
  usernameTitle = 'Hello Guest';
  connect: boolean;
  role: string;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.userService.getUser();
    this.setUserData(user);

    this.userService.userObservable.subscribe(res => this.setUserData(res));
  }

  setUserData(user) {
    this.connect = user.connect;
    this.role = user.role;

    if (this.connect) {
      this.usernameTitle = this.role === 'admin' ? 'Hello Admin !' : user.name;
    }
  }

  logout() {
    this.userService.userLogout();
    this.router.navigateByUrl('/login');
  }
}
