import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { ArticleComponent } from '../article/article.component';
import { Article, ArticlesDataService } from '../articles-data.service';
import { response } from 'express';
import { CommonModule } from '@angular/common';

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

  constructor(
    private router: Router,
    private _articlesDataService: ArticlesDataService
  ) {}


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
