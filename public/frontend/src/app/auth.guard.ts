import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MESSAGE_TYPE, ToastService } from './shared/toast/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true 
  } else {
    router.navigateByUrl("home");
    inject(ToastService).open({type: MESSAGE_TYPE.WARNING, message: "Access denied!!!"})
    return false
  }

};
