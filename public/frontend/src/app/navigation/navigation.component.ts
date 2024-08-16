import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { DropdownMenuComponent } from '../shared/dropdown-menu/dropdown-menu.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule, DropdownMenuComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  public routes = environment.ROUTES;
  
  get isLoggedIn() {
    return this._authService.isLoggedIn;
  }

  get userCredetials() {
    return this._authService.userCredentials;
  }

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {}

  logout() {
    localStorage.clear();
    this._authService.isLoggedIn = false;
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
  }
    this._router.navigate([this.routes.HOME]);
  }
}
