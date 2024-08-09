import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { ComparePasswordDirective } from '../compare-password.directive';
import { UsersDataService } from '../users-data.service';
import { ErrorResponse } from '../reponse';

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
    private _usersDataService: UsersDataService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {this._resetRegistrationForm()}, 0)
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.control.markAllAsTouched();
      return;
    }
    console.log(this.registerForm.invalid);
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
    
    this.registerForm.setValue({
          name: null,
          username: null,
          password: null,
          confirmPassword: null
        })
   }

}
