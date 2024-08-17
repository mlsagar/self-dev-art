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
import { environment } from '../environments/environment';

const routePaths = environment.ROUTE_PATHS;

export const routes: Routes = [
    {
        path: "",
        redirectTo: routePaths.HOME,
        pathMatch: "full"
    },
    {
        path: routePaths.HOME,
        component: HomeComponent
    },
    {
        path: routePaths.REGISTER,
        component: RegisterComponent
    },
    {
        path: routePaths.LOGIN,
        component: LoginComponent
    },
    {
        path: routePaths.CREATE_POST,
        component: CreatePostComponent,
        canActivate: [authGuard]
    },
    {
        path: routePaths.EDIT_POST,
        component: EditPostComponent,
        canActivate: [authGuard]
    },
    {
        path: routePaths.SINGLE_POST,
        component: PostComponent,
        canActivate: [authGuard]
    },
    {
        path: routePaths.EDIT_COMMENT,
        component: EditCommentComponent,
        canActivate: [authGuard]
    },
    {
        path: routePaths.ERROR_PAGE,
        component: ErrorPageComponent
    },
];
