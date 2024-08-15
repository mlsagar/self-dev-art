import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { ComparePasswordDirective } from '../compare-password.directive';
import { UsersDataService } from '../users-data.service';
import { ErrorResponse } from '../reponse';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ComparePasswordDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  @ViewChild("registerForm")
    registerForm!: NgForm;

  constructor(
    private _usersDataService: UsersDataService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if(this._authService.isLoggedIn) {
      this._router.navigate(["/home"]);
    }
    setTimeout(() => {this._resetRegistrationForm()}, 0)
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.control.markAllAsTouched();
      return;
    }
    const {confirmPassword, ...userData} = this.registerForm.value;
    this._usersDataService.register(userData).subscribe({
      next: response => {
        console.log(response.message);
        this._resetRegistrationForm();
      },
      error: (error: ErrorResponse<[]>) => {
        console.log(error.error.message);
      }
    })
   }

   _resetRegistrationForm() {
    
    this.registerForm.reset();
   }

}
