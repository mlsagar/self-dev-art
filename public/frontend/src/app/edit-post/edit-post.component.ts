import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Article, ArticlesDataService } from '../articles-data.service';
import { Response } from '../reponse';

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
    this.article = this._router.getCurrentNavigation()?.extras.state as Article;    
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
      next: this._handlingFullUpdateSuccess,
      error: this._handlingError
    })
  }

  _handlingFullUpdateSuccess(response: Response<any>) {
    this.editPostForm.reset();
    console.log(response);
  }

  _handlingError(error: Response<any>) {
    console.log(error)
  }

  _enablingButton() {
    this.isButtonDisabled = false;
  }
}
