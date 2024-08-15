import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { DropdownConfig, DropdownMenuComponent } from '../shared/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, CommonModule, DropdownMenuComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  logoutConfig: DropdownConfig = {
    config: [
      {
        name: "Logout",
        routeLink: "/"
      }
    ]
  }

  get isLoggedIn() {
    return this._authService.isLoggedIn;
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
    this._router.navigateByUrl("home");
  }
}
