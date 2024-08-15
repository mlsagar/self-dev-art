import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { environment } from '../../environments/environment';
import { Article, ArticlesDataService } from '../articles-data.service';
import { AuthService } from '../auth.service';
import { ErrorResponse, Response } from '../reponse';
import { ArticleComponent } from '../shared/article/article.component';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ArticleComponent, CommonModule, InfiniteScrollDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  title = environment.APP_TITLE;
  articles: Article[] = [];

  get isLoggedIn() {
    return this._authService.isLoggedIn;
  }

  count = environment.INITIAL_ARTICLE_COUNT;

  constructor(
    private _articlesDataService: ArticlesDataService,
    private _authService: AuthService,
    private _toast: ToastService
  ) {
  }


  ngOnInit(): void {
    this._getAllArticles();
  }

  _getAllArticles(count = environment.INITIAL_ARTICLE_COUNT) {
    this._articlesDataService.allArticles(count).subscribe({
      next: this._onGetArticlesSuccess.bind(this),
      error: this._onGetArticlesError.bind(this)
    })
  }

  _onGetArticlesSuccess(response: Response<any>) {
    this.articles = response.data;
  }

  _onGetArticlesError(error: ErrorResponse<any>) {
    this._toast.open({type: MESSAGE_TYPE.ERROR, message: error.error.message});
  }
  
  onScroll() {
    if (this.isLoggedIn) {      
      if(this.articles.length < this.count){
        return;
      }
      this.count += environment.INITIAL_ARTICLE_COUNT;
      this._getAllArticles(this.count);
    }
  }
}
