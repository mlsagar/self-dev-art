import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { ToastComponent } from './shared/toast/toast.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{  
  title = 'frontend';

  constructor(
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    const isTokenPresent = localStorage.getItem("user");
    if (isTokenPresent) {
      this._authService.isLoggedIn = true;
    } else {
      this._authService.isLoggedIn = false;
    }
  }
}
