import {TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ErrorInterceptor } from './error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountService } from '../authentication/services/account.service';
import { AppRoutingModule } from '../app-routing.module';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {throwError} from "rxjs";

describe('ErrorInterceptor', () => {
  let sut: ErrorInterceptor;
  let accountService: AccountService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppRoutingModule, RouterTestingModule.withRoutes([])],

      providers: [
        AccountService,
        ErrorInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
    }).compileComponents();
    sut = TestBed.inject(ErrorInterceptor);
    accountService = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should logout and redirect to login page on 401', () => {
      //arrange
      let httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      let httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError({status: 401,
          error: {
            message: 'test-error'},
          }
      ));

      sut.intercept(httpRequestSpy, httpHandlerSpy).subscribe(result => {
         fail("This should not happen")
      }, error => {
        expect(error).toEqual('test-error')
      })

      expect(mockRouter.navigate).toHaveBeenCalledWith(["/account/login"]);
  })

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
