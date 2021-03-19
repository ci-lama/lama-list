import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { AuthenticationService } from './services/authentication.service';


@NgModule({
  declarations: [
    AuthenticationService
  ],
  imports: [
    CommonModule,
    AuthenticationRoutingModule
  ]
})
export class AuthenticationModule { }
