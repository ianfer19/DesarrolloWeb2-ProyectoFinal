import { HttpClient } from '@angular/common/http';
import { Component, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioServiceService } from 'src/app/services/Usuario/usuario-service.service';

@Component({
  selector: 'app-ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css']
})
export class VerUsuariosComponent {

  users: any[] | undefined;
  myForm!: FormGroup;
  data: any[] | undefined;
  showModal: boolean = false;
  selectedUser: any | null = null;
  editedUser: any | null = null;

  constructor(private http: HttpClient, private router: Router, private userService: UsuarioServiceService, private fb: FormBuilder) {}

  ngOnInit() {
    this.leerUsuarios();
    this.myForm = this.fb.group({
      id_usuario: [''],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      tipo: [],
      contrasena:[],
      usuario: [],
      estado: [],
      fechaelinacion: [],
    });
  }

  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }

  leerUsuarios() {
    this.userService.getUsuarios().subscribe(
      (data) => {
        this.users = data;
        console.log(this.users)
      },
      (error) => {
        console.error('Error al leer usuarios:', error);
      }
    );
  }

  editar(datos: { nombre: any; tipo: any; contrasena: any;  usuario: any, estado:any, id_usuario: any;}) {
    this.myForm.setValue({
      nombre: datos.nombre,
      tipo: datos.tipo,
      contrasena: datos.contrasena,
      usuario: datos.usuario,
      estado : datos.estado,
      id_usuario: datos.id_usuario
    })
  }

  editarUsuario(form: FormGroup) {
    const id = form.value.id; 
    this.userService.actualizarUsuario(id,form.value)
      .subscribe(data => {
        alert("Se actualizó con exito!!!")
        this.refresh();
      });
      this.showModal=false;
}

  activarUsuario(id: number) {
    this.userService.activarUsuario(id)
    .subscribe(data => {
      alert("Se activó con exito!!!")
      this.refresh();
    });
  }
  
  desactivarUsuario(id:number) {
    this.userService.eliminarUsuario(id)
    .subscribe(data => {
      alert("Se desactivó con exito!!!")
      this.refresh();
    });
  }

  refresh() {
    this.userService.getUsuarios()
      .subscribe(datos => {
        this.users = datos;
      });
}

cancelarEdicion() {
  this.editedUser = null;
  this.showModal=false;
}
}
