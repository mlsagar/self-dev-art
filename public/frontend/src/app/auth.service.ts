import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { UsersDataService } from './users-data.service';
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

  get userToken() {
    return JSON.parse(localStorage.getItem(this.userLocalStorageKey) as string).token
  }

  constructor(
    private _usersDataService: UsersDataService
  ) { }
}
