import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

export interface UserValue {
  id?: number;
  token: string;
  roles: { authority: string }[];
}

export interface ChangePassword {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPassword {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private postService: HttpClient) { }

  private userValue: UserValue = {} as UserValue;
  private isUserLoggedIn: boolean = false;
  private currentUser: string | null = null;

  // base URL for all API calls (NGINX)
  private readonly apiBaseUrl = environment.apiBaseUrl || environment.animalBaseUrl || '/api';

  login(username: string, password: string): Observable<boolean> {
    const body = { username, password };
    const url = `${this.apiBaseUrl}/auth/login`;

    return this.postService.post<any>(url, body).pipe(
      map(responseData => {
        if (responseData && responseData.hasOwnProperty('token')) {
          this.isUserLoggedIn = true;

          this.userValue = {
            id: responseData.id,
            roles: responseData.roles,
            token: responseData.token,
          };

          localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? 'true' : 'false');
          localStorage.setItem('userValue', JSON.stringify(this.userValue));
          localStorage.setItem('username', username);

          this.currentUser = username;
          return true;
        }

        this.logout();
        return false;
      }),
      catchError(error => {
        console.error("Error during login", error);
        return of(false);
      })
    );
  }

  logout(): void {
    this.isUserLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('userValue');
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    const storeData = localStorage.getItem('isUserLoggedIn');
    this.isUserLoggedIn = !!(storeData && storeData === 'true');
    return this.isUserLoggedIn;
  }

  getUserValue(): UserValue {
    const storeData = localStorage.getItem('userValue');
    if (storeData) {
      this.userValue = JSON.parse(storeData);
    }
    return this.userValue;
  }

  isAdmin(): boolean {
    const storeData = localStorage.getItem('userValue');
    if (storeData) {
      const userValue: UserValue = JSON.parse(storeData);
      return userValue.roles?.some(role => role.authority === 'ROLE_ADMIN') ?? false;
    }
    return false;
  }

  getRole(): string | null {
    this.getUserValue();
    return this.userValue.roles && this.userValue.roles.length > 0
      ? this.userValue.roles[0].authority
      : null;
  }

  getToken(): string | null {
    const userValue = this.getUserValue();
    return userValue.token || null;
  }

  getUserId(): number | null {
    const userValue = this.getUserValue();
    return userValue.id || null;
  }

  getCurrentUser(): string | null {
    // if refreshed, also try localStorage
    if (!this.currentUser) {
      this.currentUser = localStorage.getItem('username');
    }
    return this.currentUser;
  }
}
