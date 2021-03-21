import {TestBed} from '@angular/core/testing';
import {
    HttpClientTestingModule, HttpTestingController,
} from '@angular/common/http/testing';
import { ErrorInterceptor } from './error.interceptor';
import {HTTP_INTERCEPTORS, HttpClient, HttpRequest} from '@angular/common/http';
import { AccountService } from '../authentication/services/account.service';
import { AppRoutingModule } from '../app-routing.module';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {throwError} from "rxjs";
import {JwtInterceptor} from "./jtw.interceptor";
import {User} from "../model/user.model";

describe('JwtInterceptor', () => {
    let sut: JwtInterceptor;
    let accountService: AccountService;
    let httpMock: HttpTestingController;
    let router: Router;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, AppRoutingModule, RouterTestingModule.withRoutes([])],

            providers: [
                AccountService,
                JwtInterceptor,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInterceptor,
                    multi: true
                }
            ]
        }).compileComponents();
        sut = TestBed.inject(JwtInterceptor);
        router = TestBed.inject(Router);
        accountService = TestBed.inject(AccountService);
        httpMock = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(sut).toBeTruthy();
    });

    it('should add bearer token header if logged in and api called', () => {
        let usr = new User();
        usr.token = "abcde";
        localStorage.setItem('user', JSON.stringify(usr));

        accountService.initUserSubject();
        accountService.getById("1").subscribe(response => {
            expect(response).toBeTruthy()
        })
        const httpRequest = httpMock.expectOne("http://localhost:4000/users/1");
        expect(httpRequest.request.headers.has("Authorization")).toEqual(true);
    })

    it('should not add bearer token header if not logged in and api called', () => {

        localStorage.removeItem('user');

        accountService.initUserSubject();
        accountService.getById("1").subscribe(response => {
            expect(response).toBeTruthy()
        })
        const httpRequest = httpMock.expectOne("http://localhost:4000/users/1");
        expect(httpRequest.request.headers.has("Authorization")).toEqual(false);
    })

    afterAll(() => {
        TestBed.resetTestingModule();
    });

});
