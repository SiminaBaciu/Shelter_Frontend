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


  constructor(private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn();

    if (this.isUserLoggedIn) {
      const user = this.authService.getUserValue();
      const token = user.token;
      console.log("TOken", token)

      if (token) {
        const decodedToken: any = jwt_decode(token);
        console.log(decodedToken);

        const currentTime = new Date().getTime() / 1000;
        const remainingTime = decodedToken.exp - currentTime;

        if (remainingTime < 0) {
          this.logout();
        }
        else {
          const role = this.authService.getRole();
          this.isAdmin = role === 'ROLE_ADMIN';
          this.isUser = role === 'ROLE_USER';
        }
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }

  }


  logout() {
    this.authService.logout();
    return this.router.navigate(['auth/login']);
  }
}
