import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.userService.getUser();
    this.username = user && user.firstName;

    this.userService.userObservable.subscribe(res => this.username = res && res.firstName);
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/login');
  }
}
