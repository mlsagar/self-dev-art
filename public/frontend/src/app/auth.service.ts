import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #isLoggedIn: WritableSignal<boolean> = signal(false);
  userLocalStorageKey = environment.LOCAL_STORAGE.USER;

  set isLoggedIn(isLogin: boolean) {
    this.#isLoggedIn.set(isLogin);
  }

  get isLoggedIn() {
    return this.#isLoggedIn();
  }

  set userToken(token: string | null) {
    if (token) {
      localStorage.setItem(this.userLocalStorageKey, JSON.stringify({token}));
    }
  }

  get userToken() {
    const userValue = localStorage.getItem(this.userLocalStorageKey);

    if (userValue) {
      return JSON.parse(userValue).token;
    }
    return null;
  }

  constructor(
  ) { }
}
