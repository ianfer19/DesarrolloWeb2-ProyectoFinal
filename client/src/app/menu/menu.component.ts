import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { loginServiceService } from '../services/Login/login-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private router: Router, private loginService: loginServiceService, private jwtHelper: JwtHelperService) {}
 
  token = localStorage.getItem('token');
  esEmpleado: boolean | undefined;

  ngOnInit(): void {
    const rol = this.loginService.getRole();
    this.esEmpleado = rol === 'Empleado';
  }
  
  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }

  logOut(){
    this.loginService.logOut(this.token)
    .subscribe(response =>{
      this.router.navigate(['/login']);
    });
    localStorage.removeItem('token');
  }


}
