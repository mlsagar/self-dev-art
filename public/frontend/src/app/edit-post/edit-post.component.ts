import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Article, ArticleRequest, ArticlesDataService } from '../articles-data.service';
import { Response } from '../reponse';

export enum CRUD_ACTION {
  "PUT" = 'put',
  "PATCH" = "patch"
}

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent {
  editPostForm!: FormGroup;

  isButtonDisabled = false;
  article!: Article;
  crudAction!: CRUD_ACTION;

  get title() {
    return this.editPostForm.get("title");
  }
  get author() {
    return this.editPostForm.get("author");
  }
  get link() {
    return this.editPostForm.get("link");
  }
  get imageLink() {
    return this.editPostForm.get("imageLink");
  }

  constructor(
    private formBuilder: FormBuilder,
    private _articlesDataService: ArticlesDataService,
    private _router: Router,
    private _location: Location
  ){
    this.article = this._router.getCurrentNavigation()?.extras.state?.["article"] as Article;
    this.crudAction = this._router.getCurrentNavigation()?.extras.state?.["action"] as CRUD_ACTION;
    

    if (!this.article) {  
      this._location.back();
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

  get _createEditForm() {
    return this.formBuilder.group({
      title: [this.article.title, [Validators.required, Validators.minLength(3)]],
      author: [this.article.author, [Validators.required, Validators.minLength(3)]],
      link: [this.article.link, [Validators.required]],
      imageLink: [this.article.imageLink, [Validators.required]]
    })
  }

  _fullUpdate() {
    this._articlesDataService.fullUpdate(this.article._id, this.editPostForm.value)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingUpdateSuccess.bind(this),
      error: this._handlingError
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
      alert("No changes! Please change");
      return;
    }

    this._articlesDataService.partialUpdate(this.article._id, newRequestObject)
    .pipe(finalize(this._enablingButton))
    .subscribe({
      next: this._handlingUpdateSuccess.bind(this),
      error: this._handlingError
    })
  }

  _handlingUpdateSuccess(response: Response<any>) {
    this.editPostForm.reset();
    this._router.navigateByUrl("home");
    console.log(response.message);
  }

  _handlingError(error: Response<any>) {
    console.log(error.message)
  }

  _enablingButton() {
    this.isButtonDisabled = false;
  }
}
