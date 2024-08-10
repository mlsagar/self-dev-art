import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = environment.APP_TITLE;

  constructor(
    private router: Router
  ) {}

  routeTo() {
    this.router.navigateByUrl("register");
  }
}
