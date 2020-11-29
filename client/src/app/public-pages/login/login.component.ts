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
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.logGroup = this.formBuilder.group({
      usernameMail: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.userService.logUser(this.logGroup.value).subscribe(data => {
      console.log("🚀 ~ file: login.component.ts ~ line 31 ~ LoginComponent ~ this.userService.logUser ~ data", data)
      this.userService.userSubject.next(data);
      this.userService.refreshUserEvnt.emit(data);
      this.cleanForm();
      this.router.navigateByUrl('/shopping');
    },
      err => {
        if (err.error === 'Unauthorized') {
          this.snackBar.open('user does not exist');
        } else {
          this.snackBar.open('something went wrong, please try again');
        }
      });
  }

  cleanForm() {
    this.logGroup = this.formBuilder.group({
      usernameMail: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
}
