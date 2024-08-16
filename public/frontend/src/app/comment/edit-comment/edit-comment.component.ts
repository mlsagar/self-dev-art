import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CommentsDataService, CommentWithArticleId } from '../../comments-data.service';
import { ErrorResponse, Response } from '../../reponse';
import { CRUD_ACTION } from '../../auth.service';
import { MESSAGE_TYPE, ToastService } from '../../shared/toast/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-comment.component.html',
  styleUrl: './edit-comment.component.css'
})
export class EditCommentComponent {
  editCommentForm!: FormGroup;
  routerStates = environment.ROUTER_STATES;
  messages = environment.MESSAGES;
  commentForm = environment.COMMENT_FORM;
  validators = environment.VALIDATORS;

  isButtonDisabled = false;
  commentValue!: CommentWithArticleId;
  crudAction!: CRUD_ACTION;
  publicCrudAction = CRUD_ACTION

  get name() {
    return this.editCommentForm.get(this.commentForm.NAME);
  }
  get comment() {
    return this.editCommentForm.get(this.commentForm.COMMENT);
  }

  constructor(
    private formBuilder: FormBuilder,
    private _commentsDataService: CommentsDataService,
    private _router: Router,
    private _location: Location,
    private _toast: ToastService
  ){
    this.commentValue = this._router.getCurrentNavigation()?.extras.state?.[this.routerStates.COMMENT] as CommentWithArticleId;
    this.crudAction = this._router.getCurrentNavigation()?.extras.state?.[this.routerStates.ACTION] as CRUD_ACTION;
    

    if (!this.commentValue) {  
      this.back();
      this._toast.open({type: MESSAGE_TYPE.WARNING, message: this.messages.SOMETHING_WENT_WRONG});
      return;
    }
  }

  ngOnInit(): void {
    this.editCommentForm = this._createEditForm;
  }

  editComment() {
    if (this.editCommentForm.invalid) {
      this.editCommentForm.markAllAsTouched();
      return;
    }
    this.isButtonDisabled = true;
    if (this.crudAction === CRUD_ACTION.PATCH) {
      this._partialUpdate();
      return;
    }
    this._fullUpdate();    
  }

  deleteComment() {
    this._commentsDataService.deleteComment(this.commentValue.articleId, this.commentValue._id)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingSuccess.bind(this),
      error: this._handlingError.bind(this)
    })
  }

  back() {
    this._location.back();
  }

  get _createEditForm() {
    return this.formBuilder.group({
      [this.commentForm.NAME]: [this.commentValue.name, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_3)]],
      [this.commentForm.COMMENT]: [this.commentValue.comment, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_5)]]
    })
  }

  _fullUpdate() {
    this._commentsDataService.fullUpdate(this.commentValue.articleId, this.commentValue._id, this.editCommentForm.value)
    .pipe(finalize(this._enablingButton.bind(this)))
    .subscribe({
      next: this._handlingSuccess.bind(this),
      error: this._handlingError.bind(this)
    })
  }

  _partialUpdate() {
    const newRequestObject: any = {};
    if (this.name?.value !== this.commentValue.name) {
      newRequestObject.name = this.name?.value;
    }
    if (this.comment?.value !== this.commentValue.comment) {
      newRequestObject.comment = this.comment?.value;    }

    if (!Object.keys(newRequestObject).length) {
      this._toast.open({type: MESSAGE_TYPE.WARNING, message: this.messages.NO_CHANGES_MADE});
      return;
    }
    this._partialUpdateComment(this.commentValue.articleId, this.commentValue._id, newRequestObject)
  }

  _partialUpdateComment(articleId: string, commentId: string, newRequestObject: any) {
    this._commentsDataService.partialUpdate(articleId, commentId, newRequestObject)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingSuccess.bind(this),
      error: this._handlingError.bind(this)
    })
  }

  _handlingSuccess(response: Response<any>) {
    this.editCommentForm.reset();
    this.back();
    this._toast.open({type: MESSAGE_TYPE.SUCCESS, message: response.message});
  }

  _handlingError(error: ErrorResponse<any>) {
    this._toast.open({type: MESSAGE_TYPE.ERROR, message: error.error.message});
  }

  _enablingButton() {
    this.isButtonDisabled = false;
  }
}
