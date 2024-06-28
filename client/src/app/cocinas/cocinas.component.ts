import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from '../services/Pedido/pedido.service';
import { DetallesPedidoService } from '../services/DetallesPedido/detalles-pedido.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cocinas',
  templateUrl: './cocinas.component.html',
  styleUrls: ['./cocinas.component.css'],
})
export class CocinasComponent implements OnInit{
  
  pedidos: any[] = [];
  detallesPedido: { [key: number]: any[] } = {}; // Mapa de pedidos a detalles
  pedidosForm!: FormGroup;

  constructor(
    private router: Router,
    private pedidoService: PedidoService,
    private detallesPedidoService: DetallesPedidoService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.leerPedidos();
    this.pedidosForm = this.fb.group({
      id: [''],
      id_cliente: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      tipo_pedido: [],
      id_mesa:[],
      fecha_pedido: [],
      total_pedido: [],
      estado: [],
    });
    this.pedidoService.observeNewPedidos().subscribe(
      (newPedidos) => {
        // Actualizar la lista de pedidos con los nuevos datos
        this.pedidos = newPedidos;
      },
      (error) => {
        console.error('Error al observar nuevos pedidos:', error);
      }
    );
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }

  leerPedidos() {
    this.pedidoService.getPedidos().subscribe(
      (data) => {
        this.pedidos = data;

        // Iterar sobre los pedidos y obtener los detalles de cada pedido
        this.pedidos.forEach(pedido => {
          this.leerDetallePedido(pedido.id_pedido); // Pasar el id del pedido a la función leerDetallePedido
        });
      },
      (error) => {
        console.error('Error al leer pedidos:', error);
      }
    );
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

  cambiarEstado(form: FormGroup) {
    const id = form.value.id; 
    form.patchValue({ estado: 1 });
    console.log(form.value)
    this.pedidoService.actualizarPedido(id,form.value)
      .subscribe(data => {
        alert("Se actualizó con exito!!!")
        this.refresh();
      },
      (error) => {
        console.error('Error al terminar el pedido:', error);
      });
  }

  editar(datos: { id_cliente: any; tipo_pedido: any; id_mesa: any;  total_pedido: any, fecha_pedido:any, id_pedido: any; estado: any;}) {
    this.pedidosForm.setValue({
      id_cliente: datos.id_cliente,
      tipo_pedido: datos.tipo_pedido,
      id_mesa: datos.id_mesa,
      fecha_pedido: datos.fecha_pedido,
      total_pedido : datos.total_pedido,
      estado: datos.estado,
      id: datos.id_pedido
    })
  }

  refresh() {
    this.pedidoService.getPedidos()
      .subscribe(datos => {
        this.pedidos = datos;
      });
  }
}