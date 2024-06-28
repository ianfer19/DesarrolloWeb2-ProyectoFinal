import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class JwtInterceptorInterceptor implements HttpInterceptor {

  constructor( private router: Router, private http: HttpClient, private jwtHelper: JwtHelperService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    let decodedToken;

    if (token) {
      decodedToken = this.jwtHelper.decodeToken(token);
    } else {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }

    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        // Eliminar el token del localStorage si está expirado
        localStorage.removeItem('token');
      } else {
        // Si el token no está expirado, agregarlo a la cabecera de autorización
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (error: any) => {
          if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
          }
        }
      )
    );
  }
}
