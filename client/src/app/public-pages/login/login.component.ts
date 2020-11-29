import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logGroup: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.logGroup = this.formBuilder.group({
      usernameMail: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.userService.logUser(this.logGroup.value).subscribe(data => {
      this.userService.updateUser(data);
      this.router.navigateByUrl('/shopping');
    },
      err => {
        const errMessage = err.error === 'Unauthorized' ? 'user does not exist' : 'something went wrong, please try again';
        this.snackBar.open(errMessage);
      });
  }
}
