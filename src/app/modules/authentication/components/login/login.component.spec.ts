import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from "@angular/router/testing";
import {AuthenticationService} from "../../services/authentication.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authenticationService: AuthenticationService;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [AuthenticationService],
            imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]),],
            declarations: [LoginComponent],
        }).compileComponents().then(() => {
            authenticationService = TestBed.inject(AuthenticationService);
            router = TestBed.inject(Router);
            fixture = TestBed.createComponent(LoginComponent);
            component = fixture.componentInstance;
            component.ngOnInit();
            fixture.detectChanges();
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('form invalid when empty', () => {
        component.loginForm.controls.username.setValue("");
        component.loginForm.controls.password.setValue("");
        expect(component.loginForm.valid).toBeFalsy();
    })

    it('username field validity', () => {
        const username = component.loginForm.controls.username;
        expect(username.valid).toBeFalsy();

        username.setValue('');
        expect(username.hasError('required')).toBeTruthy();

    });

    it('password field validity', () => {
        const password = component.loginForm.controls.password;
        expect(password.valid).toBeFalsy();

        password.setValue('');
        expect(password.hasError('required')).toBeTruthy();

    });

    it('should set submitted to true', () => {
        component.onSubmit();
        expect(component.submitted).toBeTruthy();
    });

    it('should call onSubmit method', () => {
        const spy = spyOn(component, 'onSubmit').and.callThrough();
        let el = fixture.debugElement.query(By.css('button')).nativeElement;
        el.click();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call onSubmit method but not AuthenticationService as no password given', () => {
        const spy = spyOn(component, 'onSubmit').and.callThrough();
        const authSpy = spyOn(authenticationService, "login");

        let userInputNE = fixture.debugElement.query(By.css("#username")).nativeElement;
        userInputNE.value = "Hans"

        let buttonNE = fixture.debugElement.query(By.css('button')).nativeElement;
        buttonNE.click();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onSubmit method but not AuthenticationService as no username given', () => {
        const spy = spyOn(component, 'onSubmit').and.callThrough();
        const authSpy = spyOn(authenticationService, "login");

        let passwordNE = fixture.debugElement.query(By.css("#password")).nativeElement;
        passwordNE.value = "password"

        let buttonNE = fixture.debugElement.query(By.css('button')).nativeElement;
        buttonNE.click();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onSubmit method and AuthenticationService', () => {
        const spy = spyOn(component, 'onSubmit').and.callThrough();
        const authSpy = spyOn(authenticationService, "login").and.callFake((user, password) => {
            return new Observable((observer) => {
                observer.next(true)
            });
        });
        const routerSpy = spyOn(router, "navigate");

        let userInputNE = fixture.debugElement.query(By.css("#username")).nativeElement;
        userInputNE.value = "Hans"
        userInputNE.dispatchEvent(new Event('input'));

        let passwordNE = fixture.debugElement.query(By.css("#password")).nativeElement;
        passwordNE.value = "password"
        passwordNE.dispatchEvent(new Event('input'));

        let buttonNE = fixture.debugElement.query(By.css('button')).nativeElement;
        buttonNE.click();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledTimes(1);
        expect(routerSpy).toHaveBeenCalledWith(["/"])
    });

    it('will receive an error from AuthenticationService', () => {
        const spy = spyOn(component, 'onSubmit').and.callThrough();
        const authSpy = spyOn(authenticationService, "login").and.callFake((user, password) => {
            return new Observable((observer) => {
                observer.error("404")
            });
        });

        let userInputNE = fixture.debugElement.query(By.css("#username")).nativeElement;
        userInputNE.value = "Hans"
        userInputNE.dispatchEvent(new Event('input'));

        let passwordNE = fixture.debugElement.query(By.css("#password")).nativeElement;
        passwordNE.value = "password"
        passwordNE.dispatchEvent(new Event('input'));

        let buttonNE = fixture.debugElement.query(By.css('button')).nativeElement;
        buttonNE.click();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(authSpy).toHaveBeenCalledTimes(1);

        expect(component.error).toBe("404")
        expect(component.loading).toBeFalse()
    });
});
