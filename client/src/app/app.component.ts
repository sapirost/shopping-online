import { Component, OnInit } from '@angular/core';
import { UserRole, User } from './models/user.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    const connectedUser = this.userService.getUser();
    if (connectedUser && connectedUser.role === UserRole.client) {
      this.userService.retrieveUserCart().subscribe();
    }
  }
}
