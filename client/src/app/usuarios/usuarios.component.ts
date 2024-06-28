import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent {
  constructor(private router: Router) {}
  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }
}
