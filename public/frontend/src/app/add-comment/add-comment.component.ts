import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CommentsDataService } from '../comments-data.service';
import { Response } from '../reponse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent implements OnInit{
  addCommentForm!: FormGroup;
  isButtonDisabled = false;
  postId!: string;
  // @Input() postId!: string;

  get name() {
    return this.addCommentForm.get("name");
  }

  get comment() {
    return this.addCommentForm.get("comment");
  }

  @Output()
    onAddComment = new EventEmitter;

  constructor(
    private formBuilder: FormBuilder,
    private _commentsDataService: CommentsDataService,
    private _activatedRoute: ActivatedRoute
  ) { 
    this.postId = this._activatedRoute.snapshot.params["postId"];
  }

  ngOnInit(): void {
    this.addCommentForm = this._createAddCommentForm;
  }

  addComment() {
    if (this.addCommentForm.invalid) {
      this.addCommentForm.markAllAsTouched();
      return;
    }
    this.isButtonDisabled = true;
    this._addCommentApiCall();
  }

  _addCommentApiCall() {
    this._commentsDataService.addComment(this.postId, this.addCommentForm.value)
    .pipe(finalize(this._enableButtonDisabled))
    .subscribe({
      next: this._handleAddCommentApiSuccess.bind(this),
      error: this._handleError
    })
  }

  get _createAddCommentForm() {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      comment: [null, [Validators.required, Validators.minLength(5)]]
    })
  }

  _handleAddCommentApiSuccess(response: Response<any>) {
    this.addCommentForm.reset();
    this.onAddComment.emit();
    console.log(response.message);
  }

  _handleError(error: Response<any>) {
    console.log(error.message)
  }

  _enableButtonDisabled() {
    this.isButtonDisabled = false;
  }
}
