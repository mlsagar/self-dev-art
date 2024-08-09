import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginUser, UsersDataService } from '../users-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: LoginUser = {
    username: null,
    password: null
  }

  constructor(
    private _usersDataService: UsersDataService
  ) {}

  login(loginForm: NgForm) {
    if(loginForm.invalid) {
      loginForm.control.markAllAsTouched();
      return;
    }

    this._usersDataService.login(loginForm.value).subscribe({
      next: (response) => {
        console.log(response);
        loginForm.reset();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
