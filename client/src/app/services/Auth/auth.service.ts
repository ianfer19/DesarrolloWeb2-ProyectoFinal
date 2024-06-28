import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { HOST_DB } from 'src/app/constans';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiServerUrl = `${HOST_DB}`;

  constructor(private http: HttpClient, private router: Router) {}

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

  getToken() {
    return localStorage.getItem('token');
  }

  logOut(token: any) {
    return this.http.post<any>(`${this.apiServerUrl}logout`, token);
  }
}
