import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  firstRegisterGroup: FormGroup;
  secondRegisterGroup: FormGroup;
  linear: false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.firstRegisterGroup = this.formBuilder.group({
      numberID: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      usernameMail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPass: ['', [Validators.required]]
    });
    this.secondRegisterGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
    });
  }

  addUser() {
    const bothForms = Object.assign(this.firstRegisterGroup.value, this.secondRegisterGroup.value);
    this.userService.addNewUser(bothForms).subscribe(data => {
      this.userService.userSubject.next(data);
      this.cleanForm();
      this.userService.refreshUserEvnt.emit(data);
      this.router.navigateByUrl('/');
    },
      err => this.snackBar.open('something went wrong! please try again...'));
  }

  cleanForm() {
    this.firstRegisterGroup = this.formBuilder.group({
      numberID: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      usernameMail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPass: ['', [Validators.required]]
    });
    this.secondRegisterGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
    });
  }

  getErrorMessage() {
    return this.firstRegisterGroup.controls.numberID.hasError('required') ? 'ID is required' :
      this.firstRegisterGroup.controls.numberID.hasError('pattern') ? 'Not a valid ID' :
        this.firstRegisterGroup.controls.numberID.hasError('isExist') ? 'ID already exist' : '';
  }
}
