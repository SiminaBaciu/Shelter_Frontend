// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../users/users.service'; 

@Injectable({ providedIn: 'root' })
export class SharedService {
    private userSource = new BehaviorSubject<User | null>(null);
    currentUser = this.userSource.asObservable();

    changeUser(user: User) {
        this.userSource.next(user);
    }
}
