import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Article, ArticlesDataService } from '../articles-data.service';
import { CRUD_ACTION } from '../auth.service';
import { ErrorResponse, Response } from '../reponse';
import { environment } from '../../environments/environment';
import { MESSAGE_TYPE, ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent {
  editPostForm!: FormGroup;
  routerStates = environment.ROUTER_STATES;
  articleForm = environment.ARTICLE_FORM;
  validators = environment.VALIDATORS;
  messages = environment.MESSAGES;
  routes = environment.ROUTES

  isButtonDisabled = false;
  article!: Article;
  crudAction!: CRUD_ACTION;
  publicCrudAction = CRUD_ACTION

  get title() {
    return this.editPostForm.get(this.articleForm.TITLE);
  }
  get author() {
    return this.editPostForm.get(this.articleForm.AUTHOR);
  }
  get link() {
    return this.editPostForm.get(this.articleForm.LINK);
  }
  get imageLink() {
    return this.editPostForm.get(this.articleForm.IMAGE_LINK);
  }

  constructor(
    private formBuilder: FormBuilder,
    private _articlesDataService: ArticlesDataService,
    private _router: Router,
    private _location: Location,
    private _toast: ToastService
  ){
    this.article = this._router.getCurrentNavigation()?.extras.state?.[this.routerStates.ARTICLE] as Article;
    this.crudAction = this._router.getCurrentNavigation()?.extras.state?.[this.routerStates.ACTION] as CRUD_ACTION;
    

    if (!this.article) {  
      this.back();
      return;
    }
  }

  ngOnInit(): void {
    this.editPostForm = this._createEditForm;
  }

  editPost() {
    if (this.editPostForm.invalid) {
      this.editPostForm.markAllAsTouched();
      return;
    }
    this.isButtonDisabled = true;

    if (this.crudAction === CRUD_ACTION.PATCH) {
      this._partialUpdate();
      return;
    }

    this._fullUpdate();    
  }

  deletePost() {
    this._articlesDataService.deleteArticle(this.article._id)
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
      [this.articleForm.TITLE]: [this.article.title, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_3)]],
      [this.articleForm.AUTHOR]: [this.article.author, [Validators.required, Validators.minLength(this.validators.MIN_LENGTH_3)]],
      [this.articleForm.LINK]: [this.article.link, Validators.required],
      [this.articleForm.IMAGE_LINK]: [this.article.imageLink, Validators.required]
    })
  }

  _fullUpdate() {
    this._articlesDataService.fullUpdate(this.article._id, this.editPostForm.value)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingSuccess.bind(this),
      error: this._handlingError.bind(this)
    })
  }

  _partialUpdate() {
    const newRequestObject: any = {};
    if (this.title?.value !== this.article.title) {
      newRequestObject.title = this.title?.value;
    }
    if (this.author?.value !== this.article.author) {
      newRequestObject.author = this.author?.value;
    }
    if (this.link?.value !== this.article.link) {
      newRequestObject.link = this.link?.value;
    }
    if (this.imageLink?.value !== this.article.imageLink) {
      newRequestObject.imageLink = this.imageLink?.value;
    }

    if (!Object.keys(newRequestObject).length) {
      this._toast.open({type: MESSAGE_TYPE.WARNING, message: this.messages.NO_CHANGES_MADE});
      return;
    }

    this._partialUpdateArticle(this.article._id, newRequestObject);
  }

  _partialUpdateArticle(articleId: string, newRequestObject: any) {
    this._articlesDataService.partialUpdate(articleId, newRequestObject)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingSuccess.bind(this),
      error: this._handlingError.bind(this)
    })
  }

  _handlingSuccess(response: Response<any>) {
    this.editPostForm.reset();
    this._toast.open({type: MESSAGE_TYPE.SUCCESS, message: response.message});
    this._router.navigate([this.routes.HOME]);
    
  }

  _handlingError(error: ErrorResponse<any>) {
    this._toast.open({type: MESSAGE_TYPE.ERROR, message: error.error.message});
  }

  _enablingButton() {
    this.isButtonDisabled = false;
  }
}
