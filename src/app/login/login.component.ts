import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loginError: string = '';
  formData: FormGroup;
  emailSent: boolean = false;
  twoFactorEnabled: boolean = false;
  translations!: Map<string, string>;
  private subscriptions: Subscription = new Subscription();


  constructor( private authService: AuthService, private router: Router, private route: ActivatedRoute, ) {
    this.formData = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }


  ngOnInit() {
  
  }



onClickSubmit(data: { username: string; password: string; }) {
  this.username = data.username;
  this.password = data.password;

  console.log('Login page: ' + this.username + ', ' + this.password);

  this.authService.login(this.username, this.password)
    .subscribe({
      next: (value: any): void => {
        console.log('Response from server: ', value);
        if (value === true) {  
          this.checkAndNavigate();
        }
      },
      error: (err: any) => {
        console.log('Complete error object:', err);
        this.loginError = err;
      }
    });
}

  checkAndNavigate() {
   
      this.router.navigate(['authenticated']);
    }
  
}
