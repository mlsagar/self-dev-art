import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from "rxjs";
import { ArticlesDataService } from '../articles-data.service';
import { environment } from '../../environments/environment';
import { ErrorResponse, Response } from '../reponse';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';


@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit{
  createPostForm!: FormGroup;

  isButtonDisabled = false;

  articleForm = environment.ARTICLE_FORM;
  validators = environment.VALIDATORS;

  get title() {
    return this.createPostForm.get(this.articleForm.TITLE);
  }
  get author() {
    return this.createPostForm.get(this.articleForm.AUTHOR);
  }
  get link() {
    return this.createPostForm.get(this.articleForm.LINK);
  }
  get imageLink() {
    return this.createPostForm.get(this.articleForm.IMAGE_LINK);
  }

  get comments() {
    return this.createPostForm.get("comments") as FormArray;
  }  

  constructor(
    private formBuilder: FormBuilder,
    private _articlesDataService: ArticlesDataService,
    private _toast: ToastService
  ) {}


  ngOnInit(): void {
    this.createPostForm = this.formBuilder.group({
      [this.articleForm.TITLE]: [null, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_3)]],
      [this.articleForm.AUTHOR]: [null, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_3)]],
      [this.articleForm.LINK]: [null, Validators.required],
      [this.articleForm.IMAGE_LINK]: [null, Validators.required],
      comments: this.formBuilder.array([])
    })
  }

  createPost() {
    if (this.createPostForm.invalid) {
      this.createPostForm.markAllAsTouched();
      return;
    }  

    this.isButtonDisabled = true;
    this._callAddArticleService();
    
  }

  addCommentField() {
    const commentGroup  = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      comment:  [null, [Validators.required, Validators.minLength(5)]]
    })
    this.comments.push(commentGroup)
  }

  _callAddArticleService() {
    this._articlesDataService.addArticle(this.createPostForm.value)
    .pipe(finalize(this._enablingButton.bind(this)))
    .subscribe({
      next: this._onAddArticleSuccess.bind(this),
      error: this._onAddArticleError.bind(this)
    })
  }

  _onAddArticleSuccess(response: Response<any>) {
    this.createPostForm.reset();
    this._toast.open({type: MESSAGE_TYPE.SUCCESS, message: response.message});
  }

  _onAddArticleError(error: ErrorResponse<any>) {
    this._toast.open({type: MESSAGE_TYPE.ERROR, message: error.error.message});
  }

  _enablingButton() {
    this.isButtonDisabled = false
  }
}
