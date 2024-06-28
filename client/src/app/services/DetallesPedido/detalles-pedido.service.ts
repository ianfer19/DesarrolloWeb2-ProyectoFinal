import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';
import { HOST_DB } from 'src/app/constans';

@Injectable({
  providedIn: 'root',
})
export class DetallesPedidoService {
  private apiUrl = `${HOST_DB}detalles-pedido`;
  private apiUrlid = `${HOST_DB}detalles-pedido`;
  private apiUrlimprimir = `${HOST_DB}detalle/imprimir`;

  constructor(private http: HttpClient) {}
  // Métodos para DetallesPedido

  // Leer todos los detallesPedidos
  getDetallesPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Leer un detallePedido por su ID
  getDetallesPedidoByIdPedido(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlid}/${id}`);
  }

  // Crear un nuevo detallePedido
  crearDetallePedido(detallePedido: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, detallePedido);
  }

  // Actualizar un detallePedido existente
  actualizarDetallePedido(id: number, detallePedido: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, detallePedido);
  }

  // Eliminar un detallePedido
  eliminarDetallePedido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  imprimirDetallesPedido(){
    return this.http.get<any>(`${this.apiUrlimprimir}`)
  }

  observeNewDetallesPedidosById(id: number): Observable<any[]> {
    return interval(5000) // Consultar cada 5 segundos
      .pipe(switchMap(() => this.getDetallesPedidoByIdPedido(id)));
  }
}
