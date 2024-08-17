import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CRUD_ACTION } from '../../auth.service';
import { CommentWithArticleId } from '../../comments-data.service';
import { DropdownConfig, DropdownMenuComponent } from '../../shared/dropdown-menu/dropdown-menu.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-display-comment',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent],
  templateUrl: './display-comment.component.html',
  styleUrl: './display-comment.component.css'
})
export class DisplayCommentComponent {
  commentPost !: CommentWithArticleId;
  commentDropdownConfig!: DropdownConfig;
  dropdownConfigActionName = environment.DROPDOWN_CONFIG_ACTION_NAME;
  routes = environment.ROUTES;
  @Input() 
    set comment(commentValue: CommentWithArticleId) {
      this.commentPost = commentValue;
      this.commentDropdownConfig = {
        config: [
          {
            name: this.dropdownConfigActionName.FULLY_EDIT,
            routeLink: this.routes.EDIT_COMMENT,
            state: {action: CRUD_ACTION.PUT, comment:commentValue}
          },
          {
            name: this.dropdownConfigActionName.PARTIAL_EDIT,
            routeLink: this.routes.EDIT_COMMENT,
            state: {action: CRUD_ACTION.PATCH, comment: commentValue}
          },
          {
            name: this.dropdownConfigActionName.DELETE,
            routeLink: this.routes.EDIT_COMMENT,
            state: {action: CRUD_ACTION.DELETE, comment: commentValue}
          },
        ]
      }
    }
    get comment() {
      return this.commentPost;
    }
}
