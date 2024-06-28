import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HOST_DB } from 'src/app/constans';
@Injectable({
  providedIn: 'root',
})
export class MesaServiceService {
  private apiUrl = `${HOST_DB}mesa`;

  constructor(private http: HttpClient) {}

  // Leer todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Leer un usuario por su ID
  getUsuario(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }

  // Crear un nuevo usuario
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  // Actualizar un usuario existente
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, usuario);
  }

  // Eliminar un usuario
  eliminarUsuario(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
