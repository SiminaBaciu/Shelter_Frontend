import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './users/users.component';
import { AnimalsComponent } from './animal/animal.component';
import { AdoptionComponent } from './adoption/adoption.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'authenticated', component: AuthenticatedComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent },
  { path: 'animals', component: AnimalsComponent },
  { path: 'adoptions', component: AdoptionComponent },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
