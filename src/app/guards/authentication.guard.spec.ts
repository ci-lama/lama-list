import { TestBed } from '@angular/core/testing';

import { AuthenticationGuard } from './authentication.guard';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";


import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../modules/authentication/services/authentication.service";
import any = jasmine.any;
import {of} from "rxjs";

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('AuthenticationGuard', () => {
  let sut: AuthenticationGuard;
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const fakeUrls = ['/', '/admin', '/crisis-center', '/a/deep/route'];
  let authenticationService: AuthenticationService;
  let router: Router;

  beforeEach(() => {


    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    });

    authenticationService = TestBed.inject(AuthenticationService)
    router = TestBed.inject(Router)
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  describe("when user is logged in", () => {
    beforeEach(() => {
      spyOn(authenticationService, 'isUserLoggedIn').and.returnValue(true);
      sut = new AuthenticationGuard(router, authenticationService);
    })

    fakeUrls.forEach((fakeUrl) => {
      it("grants access to " + fakeUrl, () => {
        const isAccessGranted = sut.canActivate(dummyRoute, fakeRouterState(fakeUrl))

        expect(isAccessGranted).toBeTrue()
      })
    })
  })

  describe('should navigate to login page if not authenticated', () => {
    beforeEach(() => {
      spyOn(authenticationService, 'isUserLoggedIn').and.returnValue(false);

      sut = new AuthenticationGuard(router, authenticationService);
    })

    fakeUrls.forEach((fakeUrl) => {
      it("grants no access to " + fakeUrl, () => {
        const navigateSpy = spyOn(router, 'navigate');
        const isAccessGranted = sut.canActivate(dummyRoute, fakeRouterState(fakeUrl))

        expect(navigateSpy).toHaveBeenCalledWith(['authentication/login'], { queryParams: { returnUrl: fakeRouterState(fakeUrl).url }});
        expect(isAccessGranted).toBeFalse();
      })
    })
  })
});
