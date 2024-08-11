import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { DisplayCommentComponent } from '../display-comment/display-comment.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DisplayCommentComponent],
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

  test() {
    console.log("hello")
  }
}
