import { Injectable } from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  static readonly USER_KEY: string = "user";

  constructor() { }

  isUserLoggedIn() : boolean {
    return localStorage.getItem(AuthenticationService.USER_KEY) != null
  }

  login(userName: string, password: string): Observable<any> {
    return new Observable()
  }
}
