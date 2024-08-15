import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { UsersDataService } from './users-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #isLoggedIn: WritableSignal<boolean> = signal(false);

  set isLoggedIn(isLogin: boolean) {
    this.#isLoggedIn.set(isLogin);
  }

  get isLoggedIn() {
    return this.#isLoggedIn();
  }

  constructor(
    private _usersDataService: UsersDataService
  ) { }
}
