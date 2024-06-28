import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HOST_DB } from 'src/app/constans';

@Injectable({
  providedIn: 'root',
})
export class loginServiceService {
  private apiServerUrl = `${HOST_DB}`;
  private readonly isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  login(auth: any) {
    return this.http
      .post<any>(`${this.apiServerUrl}login`, auth, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const body = response.body.token;
          localStorage.setItem('token', body);
          return body;
        })
      );
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isLoggedIn;
  }

  logOut(token: any) {
    return this.http.post<any>(`${this.apiServerUrl}/auth/exit`, token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.tipo;
    }
    return null;
  }
}
