import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appMatchPasswordValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: MatchPasswordValidatorDirective,
    multi: true
  }]
})
export class MatchPasswordValidatorDirective implements Validator {
  @Input() appConfirmMatchValidator: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    const controlToCompare = control.parent.get(this.appConfirmMatchValidator);
    if (controlToCompare && controlToCompare.value !== control.value) {
      return { notMatch: true };
    }
    return null;
  }

  constructor() { }
}
