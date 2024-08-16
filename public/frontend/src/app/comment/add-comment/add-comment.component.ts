import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CommentsDataService } from '../../comments-data.service';
import { ErrorResponse, Response } from '../../reponse';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MESSAGE_TYPE, ToastService } from '../../shared/toast/toast.service';

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

  commentForm = environment.COMMENT_FORM;
  params = environment.PARAMS;
  validators = environment.VALIDATORS;

  @Output()
    onAddComment = new EventEmitter;

  get name() {
    return this.addCommentForm.get(this.commentForm.NAME);
  }

  get comment() {
    return this.addCommentForm.get(this.commentForm.COMMENT);
  }  

  constructor(
    private formBuilder: FormBuilder,
    private _commentsDataService: CommentsDataService,
    private _activatedRoute: ActivatedRoute,
    private _toast: ToastService
  ) { 
    this.postId = this._activatedRoute.snapshot.params[this.params.POST_ID];
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
    .pipe(finalize(this._enablingButton.bind(this)))
    .subscribe({
      next: this._handleAddCommentApiSuccess.bind(this),
      error: this._handleError
    })
  }

  get _createAddCommentForm() {
    return this.formBuilder.group({
      [this.commentForm.NAME]: [null, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_3)]],
      [this.commentForm.COMMENT]: [null, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_5)]]
    })
  }

  _handleAddCommentApiSuccess(response: Response<any>) {
    this.addCommentForm.reset();
    this.onAddComment.emit();
    this._toast.open({type: MESSAGE_TYPE.SUCCESS, message: response.message})
  }

  _handleError(error: ErrorResponse<any>) {
    this._toast.open({type: MESSAGE_TYPE.ERROR, message: error.error.message})
  }

  _enablingButton() {
    this.isButtonDisabled = false;
  }
}
