import { TestBed } from '@angular/core/testing';

import { AuthenticationGuard } from './authentication.guard';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('AuthenticationGuard', () => {
  let sut: AuthenticationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])]
    });
    sut = TestBed.inject(AuthenticationGuard);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });
});
