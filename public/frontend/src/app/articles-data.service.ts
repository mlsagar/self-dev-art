import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Comment } from '../services/comments-data.service';
import { Response } from './reponse';

export interface ArticleRequest {
  title: string;
  link: string;
  imageLink: string;
  author: string;
  comments: Comment[];
}

export interface Article extends ArticleRequest{
  _id: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesDataService {
  routes = environment.ROUTES;
  articlesUrl = environment.BASE_URL + this.routes.ARTICLES;
  
  constructor(
    private _http: HttpClient
  ) { }

  allArticles(count: number):Observable<Response<Article>> {
      return this._http.get<Response<Article>>(this.articlesUrl + "?count=" + count);
  }
  
  addArticle(articleRequest: ArticleRequest) {
    return this._http.post<Response<any>>(this.articlesUrl, articleRequest);
  }

  oneArticle(postId: string) {
    return this._http.get<Response<Article>>(this._getArtilceUrlWithId(postId));
  }

  fullUpdate(postId: string, updateRequest: ArticleRequest) {
    return this._http.put<Response<any>>(this._getArtilceUrlWithId(postId), updateRequest);
  }

  partialUpdate(postId: string, updateRequest: Partial<ArticleRequest>) {
    return this._http.patch<Response<any>>(this._getArtilceUrlWithId(postId), updateRequest);
  }

  deleteArticle(postId: string) {
    return this._http.delete<Response<any>>(this._getArtilceUrlWithId(postId));
  }

  _getArtilceUrlWithId(postId: string) {
    return this.articlesUrl + "/" + postId;
  }
}
