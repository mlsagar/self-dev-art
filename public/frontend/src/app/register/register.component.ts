import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { ComparePasswordDirective } from '../compare-password.directive';
import { User, UsersDataService } from '../users-data.service';
import { ErrorResponse, Response } from '../reponse';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ComparePasswordDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  isButtonDisabled = false;
  routes = environment.ROUTES;

  @ViewChild("registerForm")
    registerForm!: NgForm;

  constructor(
    private _usersDataService: UsersDataService,
    private _authService: AuthService,
    private _router: Router,
    private _toast: ToastService
  ) {}

  ngOnInit(): void {
    if(this._authService.isLoggedIn) {
      this._router.navigate([this.routes.HOME]);
    }
    setTimeout(() => {this._resetRegistrationForm()}, 0)
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.control.markAllAsTouched();
      return;
    }
    this.isButtonDisabled = true;
    const {confirmPassword, ...userData} = this.registerForm.value;
    this._callRegisterApi(userData);
   }

   _callRegisterApi(userData: User) {
    this._usersDataService.register(userData)
    .pipe(finalize(this._enablingButton.bind(this)))
    .subscribe({
      next: this._handleRegiterApiSuccess.bind(this),
      error: this._handleRegiterApiError.bind(this)
    })
   }

   _handleRegiterApiSuccess(response: Response<any>) {
    this._resetRegistrationForm();
    this._toast.open({type: MESSAGE_TYPE.SUCCESS, message: response.message});
   }

   _handleRegiterApiError(err: ErrorResponse<any>) {
    this._toast.open({type: MESSAGE_TYPE.ERROR, message: err.error.message})
  }

   _resetRegistrationForm() {    
    this.registerForm.reset();
   }

   _enablingButton() {
    this.isButtonDisabled = false
  }

}
