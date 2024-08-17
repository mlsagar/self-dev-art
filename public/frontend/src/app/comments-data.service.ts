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
  routes = environment.ROUTES;
  baseUrl = environment.BASE_URL;
  constructor(
    private _http: HttpClient
  ) { }

  allComments(postId: string) {
    return this._http.get<Response<Comment>>(this._getCommentsUrl(postId));
  }

  addComment(postId: string, commentRequest: CommentRequest) {
    return this._http.post<Response<any>>(this._getCommentsUrl(postId), commentRequest);
  }

  fullUpdate(postId: string, commentId: string, commentRequest: CommentRequest) {
    return this._http.put<Response<any>>(this._getCommentsUrlWithId(postId, commentId), commentRequest);
  }

  partialUpdate(postId: string, commentId: string, commentRequest: Partial<CommentRequest>) {
    return this._http.patch<Response<any>>(this._getCommentsUrlWithId(postId, commentId), commentRequest);
  }

  deleteComment(postId: string, commentId: string) {
    return this._http.delete<Response<any>>(this._getCommentsUrlWithId(postId, commentId));
  }

  _getCommentsUrl(postId: string) {
    return this.baseUrl + this.routes.ARTICLES + "/" + postId + this.routes.COMMENTS;
  }

  _getCommentsUrlWithId(postId: string, commentId: string) {
    return this._getCommentsUrl(postId) + "/" + commentId;
  }
}
