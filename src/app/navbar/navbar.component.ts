import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  isUserLoggedIn = true;
  isAdmin = true;
  isUser = true;
  isProductPage: boolean = false;


  constructor(private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.isUserLoggedIn = this.authService.isLoggedIn();
    if (this.isUserLoggedIn) {
      const role = this.authService.getRole();
      this.isAdmin = role === 'ROLE_ADMIN';
      this.isUser = role === 'ROLE_USER';
    }

  }

  logout() {
    this.authService.logout();
    return this.router.navigate(['logout']);
  }
}
