import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CRUD_ACTION } from '../edit-post/edit-post.component';
import { CommentsDataService, CommentWithArticleId } from '../comments-data.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Response } from '../reponse';

@Component({
  selector: 'app-edit-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-comment.component.html',
  styleUrl: './edit-comment.component.css'
})
export class EditCommentComponent {
  editCommentForm!: FormGroup;

  isButtonDisabled = false;
  commentValue!: CommentWithArticleId;
  crudAction!: CRUD_ACTION;
  publicCrudAction = CRUD_ACTION

  get name() {
    return this.editCommentForm.get("name");
  }
  get comment() {
    return this.editCommentForm.get("comment");
  }

  constructor(
    private formBuilder: FormBuilder,
    private _commentsDataService: CommentsDataService,
    private _router: Router,
    private _location: Location
  ){
    this.commentValue = this._router.getCurrentNavigation()?.extras.state?.["comment"] as CommentWithArticleId;
    this.crudAction = this._router.getCurrentNavigation()?.extras.state?.["action"] as CRUD_ACTION;
    

    if (!this.commentValue) {  
      this.back();
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
      error: this._handlingError
    })
  }

  back() {
    this._location.back();
  }

  get _createEditForm() {
    return this.formBuilder.group({
      name: [this.commentValue.name, [Validators.required, Validators.minLength(3)]],
      comment: [this.commentValue.comment, [Validators.required, Validators.minLength(5)]]
    })
  }

  _fullUpdate() {
    this._commentsDataService.fullUpdate(this.commentValue.articleId, this.commentValue._id, this.editCommentForm.value)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingSuccess.bind(this),
      error: this._handlingError
    })
  }

  _partialUpdate() {
    const newRequestObject: any = {};
    if (this.name?.value !== this.commentValue.name) {
      newRequestObject.name = this.name?.value;
    }
    if (this.comment?.value !== this.commentValue.comment) {
      newRequestObject.comment = this.comment?.value;
    }

    if (!Object.keys(newRequestObject).length) {
      alert("No changes! Please change");
      return;
    }

    this._commentsDataService.partialUpdate(this.commentValue.articleId, this.commentValue._id, newRequestObject)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingSuccess.bind(this),
      error: this._handlingError
    })
  }

  _handlingSuccess(response: Response<any>) {
    this.editCommentForm.reset();
    this.back();
    console.log(response.message);
  }

  _handlingError(error: Response<any>) {
    console.log(error.message)
  }

  _enablingButton() {
    this.isButtonDisabled = false;
  }
}
