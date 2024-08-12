import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DisplayCommentComponent } from '../display-comment/display-comment.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Article } from '../articles-data.service';
import { RouterLink } from '@angular/router';
import { DropdownConfig, DropdownMenuComponent } from '../shared/dropdown-menu/dropdown-menu.component';
import { CRUD_ACTION } from '../edit-post/edit-post.component';

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
  @Input() 
  set article(articleValue: Article) {
    this.articlePost = articleValue;
    this.articleDropdownConfig = {
      config: [
        {
          name: "Fully Edit Post",
          routeLink: "/edit-post",
          state: {action: CRUD_ACTION.PUT, article:articleValue}
        },
        {
          name: "Partially Edit Post",
          routeLink: "/edit-post",
          state: {action: CRUD_ACTION.PATCH, article: articleValue}
        },
        {
          name: "Delete",
          routeLink: "/"
        },
      ]
    }
  };
  @Input() showCommentsSection = false;

  
}
