import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from "rxjs";
import { ArticlesDataService } from '../articles-data.service';


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

  get title() {
    return this.createPostForm.get("title");
  }
  get author() {
    return this.createPostForm.get("author");
  }
  get link() {
    return this.createPostForm.get("link");
  }
  get imageLink() {
    return this.createPostForm.get("imageLink");
  }

  constructor(
    private formBuilder: FormBuilder,
    private _articlesDataService: ArticlesDataService
  ) {}


  ngOnInit(): void {
    this.createPostForm = this.formBuilder.group({
      title: [null, [Validators.required, Validators.minLength(3)]],
      author: [null, [Validators.required, Validators.minLength(3)]],
      link: [null, [Validators.required]],
      imageLink: [null, [Validators.required]]
    })
  }

  createPost() {
    if (this.createPostForm.invalid) {
      this.createPostForm.markAllAsTouched();
      return;
    }

    this.isButtonDisabled = true;

    this._articlesDataService.addArticle(this.createPostForm.value)
    .pipe(finalize(() => this.isButtonDisabled = false))
    .subscribe({
      next: (response) => {
        this.createPostForm.reset();
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
