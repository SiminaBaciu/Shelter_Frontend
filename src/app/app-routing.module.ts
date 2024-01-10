import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './users/users.component';
import { DeviceComponent } from './device/device.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserDeviceComponent } from './userDevice/userDevice.component';
import { SensorDataComponent } from './monitoring/monitoring.component';
import { AdminChatComponent } from './chat/adminChat.component';
import { UserChatComponent } from './chat/userChat.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'authenticated', component: AuthenticatedComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
  { path: 'device/getUserDevices', component: UserDeviceComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_USER'] } },
  { path: 'device/getAllDevices', component: DeviceComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
  { path: 'sensor-data', component: SensorDataComponent, canActivate: [AuthGuard] },
  { path: 'admin-chat', component: AdminChatComponent },
  { path: 'user-chat', component: UserChatComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
