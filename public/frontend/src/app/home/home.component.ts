import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { Article, ArticlesDataService } from '../articles-data.service';
import { response } from 'express';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ArticleComponent } from '../shared/article/article.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ArticleComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  title = environment.APP_TITLE;
  articles: Article[] = [];

  get isLoggedIn() {
    return this._authService.isLoggedIn;
  }

  constructor(
    private router: Router,
    private _articlesDataService: ArticlesDataService,
    private _authService: AuthService
  ) {
  }


  ngOnInit(): void {
    this._articlesDataService.allArticles.subscribe({
      next: (response) => {
        this.articles = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  routeTo() {
    this.router.navigateByUrl("register");
  }

  test() {
    console.log("hello")
  }
}
