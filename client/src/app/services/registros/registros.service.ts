import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST_DB } from 'src/app/constans';

@Injectable({
  providedIn: 'root',
})
export class RegistrosService {
  private apiUrl = `${HOST_DB}registros`;

  constructor(private http: HttpClient) {}

  getTotal(fecha_inicio: any, fecha_fin: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/total`, {
      fecha_inicio,
      fecha_fin,
    });
  }

  getTotalTipo(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/totalTipo`, {
      fecha_inicio,
      fecha_fin,
    });
  }

  getTotalTipo2(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/totalTipo2`, {
      fecha_inicio,
      fecha_fin,
    });
  }

  getTotalProducto(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}totalProducto`, {
      fecha_inicio,
      fecha_fin,
    });
  }

  getTotalProducto2(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/totalProducto2`, {
      fecha_inicio,
      fecha_fin,
    });
  }

  getTotalMesa(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/totalMesa`, {
      fecha_inicio,
      fecha_fin,
    });
  }

  getTotaltipoPedido(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/totalTipoPedido`, {
      fecha_inicio,
      fecha_fin,
    });
  }
}
