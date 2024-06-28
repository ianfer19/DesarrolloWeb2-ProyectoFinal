import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent {
  constructor(private router: Router) {}
  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }
}
