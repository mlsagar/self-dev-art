import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AddCommentComponent } from '../../comment/add-comment/add-comment.component';
import { Article } from '../../articles-data.service';
import { Comment, CommentWithArticleId } from '../../comments-data.service';
import { DisplayCommentComponent } from '../../display-comment/display-comment.component';
import { CRUD_ACTION } from '../../edit-post/edit-post.component';
import { DropdownConfig, DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, DisplayCommentComponent, AddCommentComponent, RouterLink, DropdownMenuComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements AfterViewInit{
  articleDropdownConfig!: DropdownConfig;
  articlePost !: Article;
  fragmentValue!: string;

  public commentWithArticleId(comment: Comment): CommentWithArticleId {
    return {articleId: this.articlePost._id, ...comment}
  }

  @ViewChild("comments") comments!: ElementRef;


  @Input() 
  set article(articleValue: Article) {
    this.articlePost = articleValue;
    this.articleDropdownConfig = {
      config: [
        {
          name: "Fully Edit",
          routeLink: "/edit-post",
          state: {action: CRUD_ACTION.PUT, article:articleValue}
        },
        {
          name: "Partially Edit",
          routeLink: "/edit-post",
          state: {action: CRUD_ACTION.PATCH, article: articleValue}
        },
        {
          name: "Delete",
          routeLink: "/edit-post",
          state: {action: CRUD_ACTION.DELETE, article: articleValue}
        },
      ]
    }
  };
  @Input() showCommentsSection = false;

  @Input()
  set fragment(value: string) {
    if (value) {
      this.fragmentValue = value;  
    }
  }
  get fragment() {
    return this.fragmentValue;
  }

  @Input() showImage = false;

  @Output()
    onAddComment = new EventEmitter()

  constructor(
    private _router: Router
  ) {}

  ngAfterViewInit(): void {
    if(this.fragmentValue) {
      this._jumpToSection(this.fragmentValue);
    }
  }

  routeTo() {
    if (!this.showCommentsSection) {
      this._router.navigateByUrl(`post/${this.articlePost._id}`);
    }
  }

  handleOnAddComment() {
    this.onAddComment.emit()
  }

  _jumpToSection(section: string | null) {
    console.log(section);
    if (section) {
      console.log(this.comments)
      console.log(document.getElementsByClassName("article"));
      console.log(document.getElementById("comments"));
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
}
