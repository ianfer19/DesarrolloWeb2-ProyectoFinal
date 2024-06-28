import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loginServiceService } from '../services/Login/login-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {
  
  constructor(private router: Router, private loginService: loginServiceService, private jwtHelper: JwtHelperService) {}

  esEmpleado: boolean | undefined;
  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }




  ngOnInit(): void {
    const rol = this.loginService.getRole();
    this.esEmpleado = rol === 'Empleado';
  }
}
