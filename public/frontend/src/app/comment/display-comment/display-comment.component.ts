import { Component, Input } from '@angular/core';
import { DropdownConfig, DropdownMenuComponent } from '../../shared/dropdown-menu/dropdown-menu.component';
import { CommonModule } from '@angular/common';
import { Comment, CommentWithArticleId } from '../../comments-data.service';
import { CRUD_ACTION } from '../../edit-post/edit-post.component';

@Component({
  selector: 'app-display-comment',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent],
  templateUrl: './display-comment.component.html',
  styleUrl: './display-comment.component.css'
})
export class DisplayCommentComponent {
  commentPost !: CommentWithArticleId;
  commentDropdownConfig!: DropdownConfig
  @Input() 
    set comment(commentValue: CommentWithArticleId) {
      this.commentPost = commentValue;
      this.commentDropdownConfig = {
        config: [
          {
            name: "Fully Edit",
            routeLink: "/edit-comment",
            state: {action: CRUD_ACTION.PUT, comment:commentValue}
          },
          {
            name: "Partially Edit",
            routeLink: "/edit-comment",
            state: {action: CRUD_ACTION.PATCH, comment: commentValue}
          },
          {
            name: "Delete",
            routeLink: "/edit-comment",
            state: {action: CRUD_ACTION.DELETE, comment: commentValue}
          },
        ]
      }
    }
    get comment() {
      return this.commentPost;
    }
}
