import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
})
export class AuthenticatedComponent implements OnInit {
  isUserLoggedIn = false;
  isAdmin = false;
  isUser = false;
  title = 'Authentication';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const userValue = this.authService.getUserValue(); // reads localStorage 'userValue'
    const token = userValue?.token;

    this.isUserLoggedIn = !!token;

    if (!token) {
      this.logout();
      return;
    }

    // Validate token expiration
    try {
      const decodedToken: any = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken?.exp && decodedToken.exp < currentTime) {
        this.logout();
        return;
      }
    } catch (e) {
      this.logout();
      return;
    }

    // roles are: { authority: string }[]
    const authorities: string[] = (userValue?.roles || []).map(r => r.authority);

    this.isAdmin = authorities.includes('ROLE_ADMIN');
    this.isUser = authorities.includes('ROLE_USER');
  }

  logout() {
    this.authService.logout();
    return this.router.navigate(['auth/login']);
  }
}
