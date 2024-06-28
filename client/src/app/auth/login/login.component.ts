import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { login } from 'src/app/interfaces/login';
import { loginServiceService } from 'src/app/services/Login/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private readonly isLoggedIn = new BehaviorSubject<boolean>(false);
  
  constructor(private router: Router, private loginService: loginServiceService) {}
  
  logIn :login={
    usuario: '',
    password: '',
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  login(form:NgForm){
    console.log(form)
    this.loginService.login(this.logIn)
    .subscribe(() =>{
      this.router.navigate(['/menu']);
      this.isLoggedIn.next(true);
    });
  }

  
}
