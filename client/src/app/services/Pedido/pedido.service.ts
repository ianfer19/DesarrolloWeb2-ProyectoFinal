import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';
import { HOST_DB } from 'src/app/constans';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = `${HOST_DB}pedido`;
  private apiUrlProductoTipo = `${HOST_DB}producto_tipo/cocina`;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}
  // Métodos para Pedidos

  // Leer todos los pedidos
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getPedidosEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}-empleados`);
  }

  // Leer un pedido por su ID
  getPedido(id_pedido: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pedido/${id_pedido}`);
  }

  getPedidoPorProductoPedido(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlProductoTipo}`);
  }

  // Crear un nuevo pedido
  crearPedido(pedido: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, pedido);
  }

  // Actualizar un pedido existente
  actualizarPedido(id: number, pedido: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pedido);
  }

  // Eliminar un pedido
  eliminarPedido(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  observeNewPedidos(): Observable<any[]> {
    return interval(5000) // Consultar cada 5 segundos
      .pipe(switchMap(() => this.getPedidoPorProductoPedido()));
  }

  observeNewPedidosEmpleados(): Observable<any[]> {
    return interval(5000) // Consultar cada 5 segundos
      .pipe(switchMap(() => this.getPedidosEmpleados()));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUsuario() {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.id;
    }
    return null;
  }
}
