import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appComparePassword]',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ComparePasswordDirective,
    multi: true
  }]
})
export class ComparePasswordDirective implements Validator {
  
  constructor() { }
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && confirmPassword.value === password.value ? null : {comparePassword: true};
  }

}
