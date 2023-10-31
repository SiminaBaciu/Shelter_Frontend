import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router'; // Import Router

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { } // Inject Router

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authService.getUserValue();
    const isLoggedIn = this.authService.isLoggedIn();
    const isApiUrl = request.url.startsWith('/api');
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${user.tokenKey}`}
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) { 
          this.authService.logout(); 
          this.router.navigate(['auth/login']); 
        }

        return throwError(err);
      })
    );
  }
}
