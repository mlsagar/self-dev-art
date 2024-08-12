import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DisplayCommentComponent } from '../display-comment/display-comment.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Article } from '../articles-data.service';
import { RouterLink } from '@angular/router';
import { DropdownConfig, DropdownMenuComponent } from '../shared/dropdown-menu/dropdown-menu.component';

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
          name: "Edit",
          routeLink: "/edit-post",
          state: articleValue
        },
        {
          name: "Edit Title Only",
          routeLink: "/"
        },
        {
          name: "Edit Author Only",
          routeLink: "/"
        },
        {
          name: "Edit Link Only",
          routeLink: "/"
        },
        {
          name: "Edit Image Link Only",
          routeLink: "/"
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
