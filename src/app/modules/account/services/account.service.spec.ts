import { TestBed } from '@angular/core/testing';

import { AccountService } from './account.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {User} from "../../../model/user.model";

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    });
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('expect userSubject to be created from localstorage', () => {
    let user = new User();
    user.firstName = "hans";
    localStorage.setItem('user', JSON.stringify(user));
    service.initUserSubject();

    expect(service.userValue.firstName).toBe("hans")
  })

});
