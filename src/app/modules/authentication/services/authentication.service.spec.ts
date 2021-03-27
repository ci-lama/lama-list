import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import {User} from "../../../model/user.model";

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be logged in', () => {
    let user = new User();
    localStorage.setItem(AuthenticationService.USER_KEY, JSON.stringify(user));
    expect(service.isUserLoggedIn()).toBeTrue();
  })

  it('should not be logged in', () => {
    localStorage.removeItem(AuthenticationService.USER_KEY);
    expect(service.isUserLoggedIn()).toBeFalse();
  })
});
