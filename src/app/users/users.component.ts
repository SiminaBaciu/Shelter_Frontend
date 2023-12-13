import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../users/users.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WebSocketService } from '../notification/websockets.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    users: User[] = [];
    selectedUser: User | null = null;
    usernameError: string | null = null;
    roleError: string | null = null;
    passwordError: string | null = "password required"
    addUserForm: FormGroup;
    updateUserForm: FormGroup;

    notifications: string[] = [];

    constructor(private userService: UserService, private authService: AuthService, private webSocketService: WebSocketService) {
        this.addUserForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            roleName: new FormControl('', Validators.required)
        });
        this.updateUserForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            roleName: new FormControl('', Validators.required)
        });
    }
    ngOnInit() {
        this.userService.getAllUsers().subscribe(
            data => {
                this.users = data;

            },
            error => {
                console.error('Error in fetching users: ', error);
                this.usernameError = "Failed to load users. Please try again later.";
            }
        );

      

    }

    private resetErrors(): void {
        this.usernameError = null;
        this.roleError = null;
        this.passwordError = "password required";
    }

    addUser(): void {
        this.resetErrors();

        if (this.addUserForm.valid) {
            const user: User = this.addUserForm.value;

            this.userService.createUser(user).subscribe(newUser => {
                this.users.push(newUser);
            },
                error => {
                    console.error('Error in creating user: ', error);
                    this.usernameError = error.error.message || "Failed to create user. Please try again later.";
                }
            );
        }

    }


    deleteUser(user: User): void {
        this.userService.deleteUser(user).subscribe(
            data => {
                this.users = this.users.filter(u => u.id !== user.id);
            },
            error => {
                console.error('Error deleting user: ', error);
                this.usernameError = "Failed to delete user. Please try again later.";
            }
        );
    }


    selectForUpdate(user: User): void {
        this.selectedUser = { ...user };
        this.updateUserForm.get('username')?.setValue(user.username);
        this.updateUserForm.get('password')?.setValue(user.password);
        this.updateUserForm.get('roleName')?.setValue(user.roleName);
    }

    updateUser(): void {
        this.resetErrors();

        if (this.updateUserForm.valid && this.selectedUser) {
            const userToUpdate: User = this.updateUserForm.value;
            userToUpdate.id = this.selectedUser.id;
            this.userService.updateUser(userToUpdate).subscribe(
                updatedUser => {
                    const index = this.users.findIndex(u => u.id === updatedUser.id);
                    if (index !== -1) {
                        this.users[index] = updatedUser;
                    }
                    this.selectedUser = null;
                },
                error => {
                    console.error('Error updating user: ', error);
                    this.usernameError = error.error.message || "Failed to update user. Please try again later.";
                }
            );
        }
    }

    /*
        ngOnDestroy() {
            this.webSocketService.disconnect();
        }
    */
}


