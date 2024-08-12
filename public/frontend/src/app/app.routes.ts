import { Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { ArticlesComponent } from './articles/articles.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreatePostComponent } from './create-post/create-post.component';

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
        path: "articles",
        component: ArticlesComponent
    },
    {
        path: "create-post",
        component: CreatePostComponent
    },
    {
        path: "**",
        component: ErrorPageComponent
    },
];
