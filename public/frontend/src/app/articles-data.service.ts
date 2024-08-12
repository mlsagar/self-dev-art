import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './comments-data.service';
import { Response } from './reponse';
import { environment } from '../environments/environment';

export interface ArticleRequest {
  title: string;
  link: string;
  imageLink: string;
  author: string;
}

export interface Article extends ArticleRequest{
  _id: string; 
  comments: Comment[]
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesDataService {
  baseUrl = environment.BASE_URL;
  routes = environment.ROUTES;
  constructor(
    private _http: HttpClient
  ) { }

  get allArticles() {
    return this._http.get<Response<Article>>(this.baseUrl + this.routes.ARTICLES);
  }

  addArticle(articleRequest: ArticleRequest) {
    return this._http.post<Response<[]>>(this.baseUrl + this.routes.ARTICLES, articleRequest);
  }
}
