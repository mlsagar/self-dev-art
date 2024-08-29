import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { ImageUploadService, ImageUrl } from '../../services/image-upload.service';
import { AuthService } from '../auth.service';
import { ComparePasswordDirective } from '../compare-password.directive';
import { ErrorResponse, Response } from '../reponse';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';
import { User, UsersDataService } from '../users-data.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ComparePasswordDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  isButtonDisabled = false;
  routes = environment.ROUTES;

  @ViewChild("registerForm")
  registerForm!: NgForm;

  constructor(
    private _usersDataService: UsersDataService,
    private _authService: AuthService,
    private _router: Router,
    private _toast: ToastService,
    private _imageUploadService: ImageUploadService
  ) { }

  ngOnInit(): void {
    if (this._authService.isLoggedIn) {
      this._router.navigate([this.routes.HOME]);
    }
    setTimeout(() => { this._resetRegistrationForm() }, 0)
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.control.markAllAsTouched();
      return;
    }
    this.isButtonDisabled = true;
    const { confirmPassword, fileImage, ...userData } = this.registerForm.value;
    this._callRegisterApi(userData);
  }

  uploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    if (file) {
      const formData = new FormData();
      formData.append("image", file[0]);
      this._imageUploadService.uploadSingleImage(formData).subscribe({
        next: this._handleUploadSingleImageSuccess.bind(this),
        error: this._handleApiError.bind(this)
      })
    }
  }

  _handleUploadSingleImageSuccess(response: Response<ImageUrl>) {
    this.registerForm.form.patchValue({
      image: response.data[0].url
    });
  }

  _callRegisterApi(userData: User) {
    this._usersDataService.register(userData)
      .pipe(finalize(this._enablingButton.bind(this)))
      .subscribe({
        next: this._handleRegiterApiSuccess.bind(this),
        error: this._handleApiError.bind(this)
      })
  }

  _handleRegiterApiSuccess(response: Response<any>) {
    this._resetRegistrationForm();
    this._toast.open({ type: MESSAGE_TYPE.SUCCESS, message: response.message });
  }

  _handleApiError(err: ErrorResponse<any>) {
    this._toast.open({ type: MESSAGE_TYPE.ERROR, message: err.error.message })
  }

  _resetRegistrationForm() {
    this.registerForm.reset();
  }

  _enablingButton() {
    this.isButtonDisabled = false
  }

}
