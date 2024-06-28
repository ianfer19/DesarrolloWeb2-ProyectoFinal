import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST_DB } from 'src/app/constans';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = `${HOST_DB}producto`;

  constructor(private http: HttpClient) {}

  // Leer todos los productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Leer un producto por su ID
  getProducto(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  // Crear un nuevo producto
  crearProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  // Actualizar un producto existente
  actualizarProducto(id: number, producto: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, producto);
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
