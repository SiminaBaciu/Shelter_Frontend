import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    constructor(private postService: HttpClient) { }

    getAllUsers(): Observable<any> {
        const postBody = {};
        const postUrl = 'http://localhost:8081/users/getallusers';

        return this.postService.post(postUrl, postBody);
    }

    createUser(user: User): Observable<any> {
        const postUrl = 'http://localhost:8081/users';
        return this.postService.post(postUrl, user);
    }

    deleteUser(user: User): Observable<any> {
        const postUrl = 'http://localhost:8081/users/deleteUser';
        return this.postService.post(postUrl, user);
    }
    updateUser(user: User): Observable<any> {
        const postUrl = 'http://localhost:8081/users/update';
        return this.postService.post(postUrl, user);
    }

    getUserIdByUsername(username: string): Observable<number> {
        const postUrl = 'http://localhost:8081/users'
        return this.postService.post<number>(`postUrl/getId`, { username: username });
      }
}