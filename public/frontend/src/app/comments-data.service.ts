import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Response } from './reponse';

export interface CommentRequest {
  name: string;
  comment: string;
}

export interface Comment extends CommentRequest{
  _id: string;  
}

export interface CommentWithArticleId extends Comment {
  articleId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsDataService {
  baseUrl = environment.BASE_URL;
  routes = environment.ROUTES;
  constructor(
    private _http: HttpClient
  ) { }

  allComments(postId: string) {
    return this._http.get<Response<Comment>>(this.baseUrl + "/" + postId + this.routes.COMMENTS);
  }

  addComment(postId: string, commentRequest: CommentRequest) {
    return this._http.post<Response<any>>(this.baseUrl + this.routes.ARTICLES + "/" + postId + this.routes.COMMENTS, commentRequest);
  }

  fullUpdate(postId: string, commentId: string, commentRequest: CommentRequest) {
    return this._http.put<Response<any>>(this.baseUrl + this.routes.ARTICLES + "/" + postId + this.routes.COMMENTS + "/" + commentId, commentRequest);
  }

  partialUpdate(postId: string, commentId: string, commentRequest: Partial<CommentRequest>) {
    return this._http.patch<Response<any>>(this.baseUrl + this.routes.ARTICLES + "/" + postId + this.routes.COMMENTS + "/" + commentId, commentRequest);
  }

  deleteComment(postId: string, commentId: string) {
    return this._http.delete<Response<any>>(this.baseUrl + this.routes.ARTICLES + "/" + postId + this.routes.COMMENTS + "/" + commentId);
  }
}
