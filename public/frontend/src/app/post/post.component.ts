import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleComponent } from '../article/article.component';
import { Article, ArticlesDataService } from '../articles-data.service';
import { Response } from '../reponse';

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

  constructor(
    private _articleDataService: ArticlesDataService,
    private _route: ActivatedRoute,
    private _location: Location
  ) {
    this.postId = this._route.snapshot.params["postId"];
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
      error: this._handlingError
    });
  }

  _handlingAllArticlseSuccess(response: Response<Article>) {
    this.article =  response.data[0];
  }

  _handlingError(error: Response<any>) {
    console.log(error.message)
  }

  
}
