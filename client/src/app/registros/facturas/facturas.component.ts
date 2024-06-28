import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FacturaService } from 'src/app/services/Factura/factura.service';
import { PedidoService } from 'src/app/services/Pedido/pedido.service';
import { DetallesPedidoService } from 'src/app/services/DetallesPedido/detalles-pedido.service';


interface pedidos {
  id_pedido:number;
  nombre_cliente: string;
  id_mesa: number;
  id_empleado: number
  tipo_pedido:string;
  total_pedido:number;
}

@Component({
  selector: 'facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent {

  facturas: any[] | undefined;
  myForm!: FormGroup;
  showModal: boolean = false;
  showModalContenido: boolean = false;
  selectedFactura: any | null = null;
  editedFactura: any | null = null;
  pedidoSeleccionado: Array<pedidos>= [];
  detallesPedido: any[] = [];
  facturaSeleccionada: any[] = [];

  constructor(private http: HttpClient, private router: Router, private facturaService: FacturaService, private fb: FormBuilder,private pedidoService: PedidoService, private detallesPedidoService: DetallesPedidoService,) {}

  ngOnInit() {
    this.leerFacturas();
    this.myForm = this.fb.group({
      id: [''],
      id_pedido: ['', Validators.required],
      fecha_factura: ['', Validators.required],
      id_empleado: ['', Validators.required],
      descuento_por: ['', Validators.required],
      adescuento_val: ['', Validators.required],
      total_factura: ['', Validators.required],
      fechaeliminacion: [''] // Este campo es opcional
    });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }

  leerFacturas() {
    this.facturaService.getFacturas().subscribe(
      (data) => {
        this.facturas = data;
        console.log(this.facturas);
      },
      (error) => {
        console.error('Error al leer facturas:', error);
      }
    );
  }

  editar(datos: any) {
    this.myForm.setValue(datos);
    this.showModal = true;
  }

  editarFactura(form: FormGroup) {
    const id = form.value.id;
    this.facturaService.actualizarFactura(id, form.value)
      .subscribe(data => {
        alert("Se actualizó con éxito!!!");
        this.refresh();
      });
    this.showModal = false;
  }

  leerPedidos(id:number) {
    this.pedidoService.getPedido(id).subscribe(
      (data) => {
        // Asignar el pedido devuelto a un array para que coincida con el tipo esperado
        this.pedidoSeleccionado = [data];
        // Iterar sobre los pedidos y obtener los detalles de cada pedido
        this.pedidoSeleccionado.forEach((pedido) => {
          this.leerDetallePedido(pedido.id_pedido); // Pasar el id del pedido a la función leerDetallePedido
        });
      },
      (error) => {
        console.error('Error al leer pedidos:', error);
      }
    );
  }
  
  leerFacturaPorIdPedido(id:number){
    this.facturaService.getFacturaIdPedido(id).subscribe(
    (data) => {
      this.facturaSeleccionada = [data];
    }, (error) => {
      console.error('Error al leer factura por id' + id)
    });
  }

  leerDetallePedido(id: number) {
    this.detallesPedidoService.getDetallesPedidoByIdPedido(id).subscribe(
      (data) => {
        this.detallesPedido[id] = data; // Almacenar detalles en el mapa con el ID del pedido como clave
      },
      (error) => {
        console.error('Error al leer detalles del pedido:', error);
      }
    );
  }

  refresh() {
    this.facturaService.getFacturas()
      .subscribe(datos => {
        this.facturas = datos;
      });
  }

  cancelarEdicion() {
    this.editedFactura = null;
    this.showModal = false;
    this.showModalContenido = false;
  }
}