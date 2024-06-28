import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HOST_DB } from 'src/app/constans';

@Component({
  selector: 'app-agregar-mesa',
  templateUrl: './agregar-mesa.component.html',
  styleUrls: ['./agregar-mesa.component.css'],
})
export class AgregarMesaComponent {
  mesa = {
    nombre: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  registrarMesa() {
    if (!this.mesa.nombre) {
      alert('Por favor, llene todos los campos.');
    } else {
      try {
        console.log(this.mesa);
        this.http.post<any>(`${HOST_DB}mesa`, this.mesa).subscribe(
          (response) => {
            console.log('Mesa registrado exitosamente:', response);
          },
          (error) => {
            console.error('Error al registrar Mesa:', error);
          }
        );
        alert('mesa registrada.');
        this.navigateTo('mesas');
      } catch (error) {
        alert('se produjo un error, compruebe la conexión a la db.');
      }
      console.log(this.mesa);
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
