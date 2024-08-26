import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Comment, CommentWithArticleId } from '../../../services/comments-data.service';
import { Article } from '../../articles-data.service';
import { CRUD_ACTION } from '../../auth.service';
import { AddCommentComponent } from '../../comment/add-comment/add-comment.component';
import { DisplayCommentComponent } from '../../comment/display-comment/display-comment.component';
import { DropdownConfig, DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, DisplayCommentComponent, AddCommentComponent, RouterLink, DropdownMenuComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  articleDropdownConfig!: DropdownConfig;
  articlePost !: Article;
  dropdownConfigActionName = environment.DROPDOWN_CONFIG_ACTION_NAME;
  routes = environment.ROUTES

  public commentWithArticleId(comment: Comment): CommentWithArticleId {
    return {articleId: this.articlePost._id, ...comment}
  }

  @Input() 
  set article(articleValue: Article) {
    this.articlePost = articleValue;
    this.articleDropdownConfig = {
      config: [
        {
          name: this.dropdownConfigActionName.FULLY_EDIT,
          routeLink: this.routes.EDIT_POST,
          state: {action: CRUD_ACTION.PUT, article:articleValue}
        },
        {
          name: this.dropdownConfigActionName.PARTIAL_EDIT,
          routeLink: this.routes.EDIT_POST,
          state: {action: CRUD_ACTION.PATCH, article: articleValue}
        },
        {
          name: this.dropdownConfigActionName.DELETE,
          routeLink: this.routes.EDIT_POST,
          state: {action: CRUD_ACTION.DELETE, article: articleValue}
        },
      ]
    }
  };
  @Input() showCommentsSection = false;

  @Input() showImage = false;

  @Output()
    onAddComment = new EventEmitter()

  constructor(
    private _router: Router
  ) {}

  routeTo() {
    if (!this.showCommentsSection) {
      this._router.navigate([`${this.routes.POST}/${this.articlePost._id}`]);
    }
  }

  handleOnAddComment() {
    this.onAddComment.emit()
  }
  
}
