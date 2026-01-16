import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Don't attach token to auth endpoints
  if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
    return next.handle(request);
  }

  const user = this.authService.getUserValue();

  // fallback: read token from storage
  const storedToken = localStorage.getItem('token'); // or sessionStorage
  const token = user?.token || storedToken;

  // normalize token (remove "Bearer " if already stored with it)
  const cleanToken = token?.startsWith('Bearer ') ? token.slice(7) : token;

  if (cleanToken) {
    request = request.clone({
      setHeaders: { Authorization: `Bearer ${cleanToken}` }
    });
  }

  return next.handle(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // Don't logout on a 401 from login endpoint (optional safety)
        if (!request.url.includes('/auth/login')) {
          this.authService.logout();
          this.router.navigate(['auth/login']);
        }
      }
      return throwError(() => err);
    })
  );
}
}