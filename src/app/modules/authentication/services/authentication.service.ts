import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  static readonly USER_KEY: string = "user";

  constructor() { }

  isUserLoggedIn() : boolean {
    return localStorage.getItem(AuthenticationService.USER_KEY) != null
  }
}
