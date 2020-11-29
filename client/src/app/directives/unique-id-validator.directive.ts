import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from './../services/user.service';

@Directive({
  selector: '[appUniqueIdValidator]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => UniqueIdValidatorDirective),
    multi: true
  }]
})
export class UniqueIdValidatorDirective implements AsyncValidator {
  @Input() appUniqueIdValidator: string;
  cntrlValue: string | null = null;

  constructor(private userService: UserService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        if (this.cntrlValue !== value) {
          this.userService.checkUserID().subscribe(data => {
            if (data.exist) {
              control.markAsTouched({ onlySelf: true });
              control.setErrors({ isExist: true });
              return observableOf({ appUniqueIdValidator: true });
            }
          });
          this.cntrlValue = value;
        }
      });
    control.setErrors({ isExist: null });
    return observableOf(null);
  }
}
