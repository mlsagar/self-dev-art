import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginUser, UsersDataService } from '../users-data.service';
import { finalize } from 'rxjs';
import { ErrorResponse, Response } from '../reponse';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  user: LoginUser = {
    username: null,
    password: null
  }
  routes = environment.ROUTES;
  messages = environment.MESSAGES;

  isButtonDisabled = false;

  constructor(
    private _usersDataService: UsersDataService,
    private _toastService: ToastService,
    private _router: Router,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    if(this._authService.isLoggedIn) {
      this._router.navigate([this.routes.HOME]);
      this._toastService.open({type: MESSAGE_TYPE.WARNING, message: this.messages.CANNOT_ACCESS_THE_PAGE_LOGIN});
      return;
    }
  }

  login(loginForm: NgForm) {
    if(loginForm.invalid) {
      loginForm.control.markAllAsTouched();
      return;
    }
    this.isButtonDisabled = true;
    this._useLoginApi(loginForm);    
  }

  _useLoginApi(loginForm: NgForm) {
    this._usersDataService.login(loginForm.value)
    .pipe(finalize(this._enablingButton.bind(this)))
    .subscribe({
      next: this._handleLoginSuccessResponse.bind(this, loginForm),
      error: this._handleError.bind(this)
    })
  }

  _handleLoginSuccessResponse(loginForm: NgForm, response: Response<any>) {
    loginForm.reset();
    this._authService.userToken = response.token || null;
    this._authService.isLoggedIn = true;
    this._router.navigate([this.routes.HOME]);
    this._toastService.open({type: MESSAGE_TYPE.SUCCESS, message: response.message});
  } 

  _handleError(err: ErrorResponse<any>) {
    this._toastService.open({type: MESSAGE_TYPE.ERROR, message: err.error.message})
  }

  _enablingButton() {
    this.isButtonDisabled = false
  }
}
