import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent {
  addCommentForm: FormGroup;

  get name() {
    return this.addCommentForm.get("name");
  }

  get comment() {
    return this.addCommentForm.get("comment");
  }

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.addCommentForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      comment: [null, [Validators.required, Validators.minLength(5)]]
    })
  }

  addComment() {
    if (this.addCommentForm.invalid) {
      this.addCommentForm.markAllAsTouched();
      return;
    }

    // call api
  }
}
