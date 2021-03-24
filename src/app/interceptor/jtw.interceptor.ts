import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AccountService} from "../account/services/account.service";
import {environment} from "../../environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Intercept");
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.accountService.userValue;
        console.log("User: " + JSON.stringify(user));
        const isLoggedIn = user && user.token;
        console.log("isLoggedIn: " + isLoggedIn);
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        console.log("isApiUrl: " + isApiUrl)
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }

        return next.handle(request);
    }
}