import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';


export interface User {
  name: String;
  username: String;
  password: String;
}

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  baseUrl = environment.BASE_URL
  constructor(
    private _http: HttpClient
  ) { }

  register(registerRequest: User) {
    return this._http.post(this.baseUrl + "/users", registerRequest)
  }
}
