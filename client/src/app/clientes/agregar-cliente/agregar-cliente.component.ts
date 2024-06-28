import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HOST_DB } from 'src/app/constans';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css'],
})
export class AgregarClienteComponent {
  cliente = {
    cc: '',
    nombre: '',
    telefono: '',
    direccion: '',
    fechacumple: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  registrarCliente() {
    if (
      !this.cliente.cc ||
      !this.cliente.nombre ||
      !this.cliente.telefono ||
      !this.cliente.direccion ||
      !this.cliente.fechacumple
    ) {
      alert('Por favor, llene todos los campos.');
    } else {
      try {
        this.http.post<any>(`${HOST_DB}cliente`, this.cliente).subscribe(
          (response) => {
            console.log('Cliente registrado exitosamente:', response);
            // Puedes agregar aquí lógica adicional después de registrar el cliente, como limpiar el formulario o redireccionar a otra página.
          },
          (error) => {
            console.error('Error al registrar cliente:', error);
            // Puedes manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario.
          }
        );
        alert('cliente registrado.');
        this.navigateTo('clientes');
      } catch (error) {
        alert('se produjo un error, compruebe la conexión a la db.');
      }
      console.log(this.cliente);
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
