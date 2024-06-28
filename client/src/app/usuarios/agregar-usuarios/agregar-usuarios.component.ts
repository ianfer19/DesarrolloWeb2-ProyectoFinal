import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HOST_DB } from 'src/app/constans';

@Component({
  selector: 'app-agregar-usuarios',
  templateUrl: './agregar-usuarios.component.html',
  styleUrls: ['./agregar-usuarios.component.css'],
})
export class AgregarUsuariosComponent {
  usuario = {
    nombre: '',
    usuario: '',
    contrasena: '',
    tipo: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  registrarUsuario(): void {
    // Verificar si algún campo está vacío
    if (
      !this.usuario.nombre ||
      !this.usuario.usuario ||
      !this.usuario.contrasena ||
      !this.usuario.tipo
    ) {
      alert('Por favor, llene todos los campos.');
    } else {
      // Lógica para registrar al cliente
      try {
        alert('usuario registrado.');
        this.http.post<any>(`${HOST_DB}auth/register`, this.usuario).subscribe(
          (response) => {
            console.log('Detalle pedido creado exitosamente');
          },
          (error) => {
            console.error('Error al crear pedido:', error);
          }
        );
        this.navigateTo('usuarios');
      } catch (error) {
        alert('se produjo un error, compruebe la conexión a la db.');
      }
      console.log(this.usuario);
    }
  }
  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }
  onInput(event: any) {
    const inputChar = event.target.value.charAt(event.target.value.length - 1);
    if (!/[0-9]/.test(inputChar)) {
      event.target.value = event.target.value.slice(0, -1);
    }
  }
}
