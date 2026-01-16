import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

export interface User {
  id: number;
  username: string;
  password: string;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.animalBaseUrl; // -> /api

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/getallusers`, {});
  }

  createUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  deleteUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/deleteUser`, user);
  }

  updateUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/update`, user);
  }

  getUserIdByUsername(username: string): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/users/getId`, { username });
  }
}
