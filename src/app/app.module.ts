import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { JwtInterceptor } from './jwt.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { DeviceComponent } from './device/device.component';
import { UserDeviceComponent } from './userDevice/userDevice.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    LogoutComponent,
    AuthenticatedComponent, 
    NavbarComponent,
    DeviceComponent,
    UserDeviceComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
