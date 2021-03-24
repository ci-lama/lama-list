import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../modules/account/services/account.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log("Deine Mutter " + JSON.stringify(err))
            if (err.status === 401) {
                console.log("Forbidden. Triggering logout")
                // auto logout if 401 response returned from api
                this.accountService.logout();
            }

            console.log("Dein Vadder wirft errors")
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}