import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRoles: string[] = route.data['roles'];
    console.log('Expected roles:', expectedRoles);
    const userRole = this.authService.getRole();
    console.log('User role:', userRole);
    if (this.authService.isLoggedIn()) {
      if (expectedRoles && expectedRoles.length > 0) {
        if (userRole !== null && expectedRoles.includes(userRole)) {
          console.log('Role matches, access granted.');
          return true;
        } else {
          console.log('Role mismatch, access denied.');
        }
      } else {
        return true;
      }
    }
    console.log('User not logged in, redirecting to login.');
    return this.router.createUrlTree(['auth/login']);
  }
  
}
