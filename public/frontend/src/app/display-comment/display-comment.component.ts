import { Component, Input } from '@angular/core';
import { DropdownConfig, DropdownMenuComponent } from '../shared/dropdown-menu/dropdown-menu.component';
import { CommonModule } from '@angular/common';
import { Comment } from '../comments-data.service';

@Component({
  selector: 'app-display-comment',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent],
  templateUrl: './display-comment.component.html',
  styleUrl: './display-comment.component.css'
})
export class DisplayCommentComponent {
  @Input() comment!: Comment;

  commentDropdownConfig: DropdownConfig = {
    config: [
      {
        name: "Edit",
        routeLink: "/"
      },
      {
        name: "Edit Name Only",
        routeLink: "/"
      },
      {
        name: "Edit Comment Only",
        routeLink: "/"
      },
      {
        name: "Delete",
        routeLink: "/"
      },
    ]
  }
}
