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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SensorDataComponent } from './monitoring/monitoring.component';
import { NgChartsModule } from 'ng2-charts';
import { WebSocketService } from './notification/websockets.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminChatComponent } from './chat/adminChat.component';
import { UserChatComponent } from './chat/userChat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    LogoutComponent,
    AuthenticatedComponent, 
    NavbarComponent,
    DeviceComponent,
    UserDeviceComponent,
    SensorDataComponent, 
    AdminChatComponent,
    UserChatComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    NgChartsModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
