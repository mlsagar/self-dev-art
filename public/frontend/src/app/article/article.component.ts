import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DisplayCommentComponent } from '../display-comment/display-comment.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { Article } from '../articles-data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, DisplayCommentComponent, AddCommentComponent, RouterLink],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {
  @Input() article!: Article;
  @Input() showCommentsSection = false
}
