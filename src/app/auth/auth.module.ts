import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { HomeComponent } from './pages/home/home.component';


@NgModule({
  declarations: [
    LoginComponent,
    PrincipalComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
