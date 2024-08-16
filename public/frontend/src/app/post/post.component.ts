import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article, ArticlesDataService } from '../articles-data.service';
import { ErrorResponse, Response } from '../reponse';
import { ArticleComponent } from '../shared/article/article.component';
import { environment } from '../../environments/environment';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, ArticleComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  postId!: string; 
  article!: Article;
  fragment!: string;

  params = environment.PARAMS

  constructor(
    private _articleDataService: ArticlesDataService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _toast: ToastService
  ) {
    this.postId = this._route.snapshot.params[this.params.POST_ID];
  }
  ngOnInit(): void {
    this.getOneArticle();
  }

  back() {
    this._location.back();
  }

  getOneArticle() {
    this._articleDataService.oneArticle(this.postId)
    .subscribe({
      next: this._handlingAllArticlseSuccess.bind(this),
      error: this._handlingError.bind(this)
    });
  }

  _handlingAllArticlseSuccess(response: Response<Article>) {
    this.article =  response.data[0];
  }

  _handlingError(error: ErrorResponse<any>) {
    this._toast.open({type: MESSAGE_TYPE.ERROR, message: error.error.message})
  }

  
}
