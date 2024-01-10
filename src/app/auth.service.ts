import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface UserValue {
  id ?: number; 
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

  login(username: string, password: string): Observable<boolean> {
    const body = { username: username, password: password };
    const url = 'http://localhost:8081/auth/login';

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
    this.currentUser = username;
}

  logout(): void {
    this.isUserLoggedIn = false;
    localStorage.removeItem('userValue');
    localStorage.removeItem('isUserLoggedIn');
  }

  isLoggedIn(): boolean {
    let storeData = localStorage.getItem('isUserLoggedIn');
    this.isUserLoggedIn = !!(storeData && storeData === 'true');
    return this.isUserLoggedIn;
  }

  getUserValue(): any {
    let storeData = localStorage.getItem('userValue');
    if (storeData) {
      this.userValue = JSON.parse(storeData);
    }
    return this.userValue;
  }

  isAdmin(): boolean {
    let storeData = localStorage.getItem('userValue');
    if (storeData) {
      const userValue: UserValue = JSON.parse(storeData);
      // Assuming 'ROLE_ADMIN' is the role you use to identify admins
      return userValue.roles.some(role => role.authority === 'ROLE_ADMIN');
    }
    return false;
  }
  
  getRole(): string | null {
    this.getUserValue();
    return this.userValue.roles && this.userValue.roles.length > 0 ? this.userValue.roles[0].authority : null;
  }

  getUserId(): number | null {
    const userValue = this.getUserValue();
    return userValue.id || null;
  }

  getCurrentUser(): string | null {
    return this.currentUser;
  }
  
}
