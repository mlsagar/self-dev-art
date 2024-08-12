import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DisplayCommentComponent } from '../display-comment/display-comment.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, DisplayCommentComponent, AddCommentComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent {

}
