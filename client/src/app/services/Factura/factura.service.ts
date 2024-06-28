import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';
import { HOST_DB } from 'src/app/constans';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = `${HOST_DB}factura`;

  constructor(private http: HttpClient) {}
  // Métodos para Facturas

  // Leer todas las facturas
  getFacturas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Leer una factura por su ID
  getFactura(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

    // Leer una factura por su ID
    getFacturaIdPedido(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/pedido/${id}`);
    }

  // Crear una nueva factura
  crearFactura(factura: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, factura);
  }

  // Actualizar una factura existente
  actualizarFactura(id: number, factura: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, factura);
  }

  // Eliminar una factura
  eliminarFactura(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  actualizarPagoFactura(id: any, factura: any){
    return this.http.put<any>(`${this.apiUrl}/?id=${id}`, factura);
  }
  
  observeNewFacturas(): Observable<any[]> {
    return interval(5000) // Consultar cada 5 segundos
      .pipe(switchMap(() => this.getFacturas()));
  }
}
