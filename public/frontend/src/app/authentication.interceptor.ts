import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const articlesUrl = environment.BASE_URL + environment.ROUTES.ARTICLES;
  const authService = inject(AuthService);
  
  if (authService.isLoggedIn && req.method === 'GET' && req.url === articlesUrl) {
    const newRequest = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${authService.userToken}`)
    })
    
    return next(newRequest);
  }
  
  return next(req);


};
