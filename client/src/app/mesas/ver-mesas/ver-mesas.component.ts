import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteServiceService } from 'src/app/services/Cliente/cliente-service.service';
import { MesaServiceService } from 'src/app/services/Mesas/mesa-service.service';

@Component({
  selector: 'app-ver-mesas',
  templateUrl: './ver-mesas.component.html',
  styleUrls: ['./ver-mesas.component.css'],
})
export class VerMesasComponent {
  users: any[] | undefined;
  myForm!: FormGroup;
  data: any[] | undefined;
  showModal: boolean = false;
  selectedUser: any | null = null;
  editedUser: any | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private clienteService: MesaServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.leerUsuarios();
    this.myForm = this.fb.group({
      id_mesa: [],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
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

  editar(datos: { nombre: any; id_mesa: any }) {
    this.myForm.setValue({
      nombre: datos.nombre,
      id_mesa: datos.id_mesa,
    });
  }

  editarUsuario(form: FormGroup) {
    const id = form.value.id_mesa;
    this.clienteService.actualizarUsuario(id, form.value).subscribe((data) => {
      alert('Se actualizó con exito!!!');
      this.refresh();
    });
    this.showModal = false;
  }

  refresh() {
    this.clienteService.getUsuarios().subscribe((datos) => {
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
