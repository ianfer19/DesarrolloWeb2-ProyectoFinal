import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteServiceService } from 'src/app/services/Cliente/cliente-service.service';
import { UsuarioServiceService } from 'src/app/services/Usuario/usuario-service.service';

@Component({
  selector: 'app-ver-clientes',
  templateUrl: './ver-clientes.component.html',
  styleUrls: ['./ver-clientes.component.css'],
})
export class VerClientesComponent {
  users: any[] | undefined;
  myForm!: FormGroup;
  data: any[] | undefined;
  showModal: boolean = false;
  selectedUser: any | null = null;
  editedUser: any | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: ClienteServiceService,
    private clienteService: ClienteServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.leerUsuarios();
    this.myForm = this.fb.group({
      id_cliente: [],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      cc: [],
      telefono: [''],
      direccion: [''],
      fechacumple: [''],
    });
  }

  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }

  leerUsuarios() {
    this.clienteService.getUsuarios().subscribe(
      (data) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.error('Error al leer usuarios:', error);
      }
    );
  }

  editar(datos: {
    nombre: any;
    cc: any;
    telefono: any;
    direccion: any;
    fechacumple: any;
    id_cliente: any;
  }) {
    this.myForm.setValue({
      nombre: datos.nombre,
      cc: datos.cc,
      telefono: datos.telefono,
      fechacumple: datos.fechacumple,
      direccion: datos.direccion,
      id_cliente: datos.id_cliente,
    });
  }

  editarUsuario(form: FormGroup) {
    const id = form.value.id_cliente;
    this.userService.actualizarUsuario(id, form.value).subscribe((data) => {
      alert('Se actualizó con exito!!!');
      this.refresh();
    });
    this.showModal = false;
  }

  refresh() {
    this.userService.getUsuarios().subscribe((datos) => {
      this.users = datos;
    });
  }

  cancelarEdicion() {
    this.editedUser = null;
    this.showModal = false;
  }

  convertirFecha(fecha: string): string {
    const meses: string[] = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = meses[fechaObj.getMonth()];

    return `Día ${dia} mes de ${mes}`;
  }
}
