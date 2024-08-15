import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { CreatePostComponent } from './create-post/create-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PostComponent } from './post/post.component';
import { RegisterComponent } from './register/register.component';
import { EditCommentComponent } from './comment/edit-comment/edit-comment.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "create-post",
        component: CreatePostComponent,
        canActivate: [authGuard]
    },
    {
        path: "edit-post",
        component: EditPostComponent,
        canActivate: [authGuard]
    },
    {
        path: "post/:postId",
        component: PostComponent,
        canActivate: [authGuard]
    },
    {
        path: "edit-comment",
        component: EditCommentComponent,
        canActivate: [authGuard]
    },
    {
        path: "**",
        component: ErrorPageComponent
    },
];
