import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './comments-data.service';
import { Response } from './reponse';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

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
    private _http: HttpClient,
    private _authService: AuthService
  ) { }

  get allArticles():Observable<Response<Article>> {
    if (this._authService.isLoggedIn()) {
      const token = JSON.parse(localStorage.getItem("user") as string).token;
      return this._http.get<Response<Article>>(this.baseUrl + this.routes.ARTICLES, {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`)
      });
    }
    return this._http.get<Response<Article>>(this.baseUrl + this.routes.ARTICLES);
  }
  
  addArticle(articleRequest: ArticleRequest) {
    return this._http.post<Response<any>>(this.baseUrl + this.routes.ARTICLES, articleRequest);
  }

  oneArticle(postId: string) {
    return this._http.get<Response<Article>>(this.baseUrl + this.routes.ARTICLES + "/" + postId);
  }

  fullUpdate(postId: string, updateRequest: ArticleRequest) {
    return this._http.put<Response<any>>(this.baseUrl + this.routes.ARTICLES + "/" + postId, updateRequest);
  }

  partialUpdate(postId: string, updateRequest: Partial<ArticleRequest>) {
    return this._http.patch<Response<any>>(this.baseUrl + this.routes.ARTICLES + "/" + postId, updateRequest);
  }

  deleteArticle(postId: string) {
    return this._http.delete<Response<any>>(this.baseUrl + this.routes.ARTICLES + "/" + postId);
  }
}
