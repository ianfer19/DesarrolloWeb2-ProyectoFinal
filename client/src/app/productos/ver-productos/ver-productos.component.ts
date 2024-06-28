import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductoService } from 'src/app/services/Producto/producto-service.service';
import { HOST_DB } from 'src/app/constans';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css'],
})
export class VerProductosComponent {
  productos: any[] | undefined;
  productoForm!: FormGroup;
  showModal: boolean = false;
  editedProducto: any | null = null;
  myForm!: FormGroup;
  data: any[] | undefined;
  productosTipo: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.obtenerProductosTipo(); //ok
    this.myForm = this.fb.group({
      id: ['', Validators.required],
      id_tipo: ['', Validators.required],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      precio: ['', Validators.required],
    });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
      console.log(this.productos);
    });
  }

  editar(datos: { id: any; nombre: any; id_tipo: any; precio: any }) {
    this.myForm.setValue({
      id: datos.id,
      nombre: datos.nombre,
      id_tipo: datos.id_tipo,
      precio: datos.precio,
    });
  }

  editarProducto(form: FormGroup) {
    const id = form.value.id;
    this.productoService
      .actualizarProducto(id, form.value)
      .subscribe((data) => {
        alert('Se actualizó con exito!!!');
        this.refresh();
      });
    this.showModal = false;
  }

  eliminarProducto(id: number) {
    console.log(id);
    this.productoService.eliminarProducto(id).subscribe(() => {
      alert('Producto eliminó exitosamente!');
      this.refresh();
    });
  }

  obtenerProductosTipo() {
    this.http.get<any[]>(`${HOST_DB}producto_tipo`).subscribe(
      (response) => {
        this.productosTipo = response;
      },
      (error) => {
        console.error('Error al obtener tipos de productos:', error);
      }
    );
  }

  nombreTipoSeleccionado(int: number | undefined) {
    const producto = this.productosTipo.filter(
      (element) => element.id_producto_tipo == int
    )[0].nombre;

    return producto;
  }

  refresh() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
    });
  }

  cancelarEdicion() {
    this.editedProducto = null;
    this.showModal = false;
    this.productoForm.reset();
  }
}
