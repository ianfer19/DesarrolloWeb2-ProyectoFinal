import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HOST_DB } from 'src/app/constans';

interface ProductoPedido {
  id_producto?: number;
  id_tipo?: number;
  nombre?: string;
  cantidad?: number;
  precio_unitario?: number;
  nota?: String;
}

interface datosPedido {
  id_user: number;
  id_mesa: number;
  tipo: String;
}
@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
})
export class AgregarProductoComponent {
  pedido = {
    idCliente: null,
    idMesa: null,
    fechaPedido: new Date().toISOString(),
    tipoPedido: '',
    totalPedido: 0,
    productos: [] as ProductoPedido[],
    idEmpleado: null, // Agregamos el campo idEmpleado para almacenar el ID del usuario que atiende el pedido
  };

  //ultimo=this.obtenerProductosTipo();
  product: ProductoPedido = {
    id_producto: 0,
    id_tipo: 16,
    nombre: '',
    cantidad: 0,
    precio_unitario: 0,
    nota: '',
  };

  datos: datosPedido = {
    id_user: 0,
    id_mesa: 0,
    tipo: '',
  };

  clientes: any[] = [];
  mesas: any[] = [];
  usuarios: any[] = []; // Variable para almacenar la lista de usuarios
  productosTipo: any[] = [];
  productos: any[] = [];
  productosMostrar: any[] = [];
  productoTipoSeleccionado: number | null = null;
  productoSeleccionado: number | null = null;
  cantidadProducto: number = 1;

  disableCliente = false;
  disableMesa = false;
  disableUSer = false;
  disableTipoPedido = false;
  localIP = '';
  nombre = '';
  precio = 1;

  constructor(private http: HttpClient, private router: Router) {
    this.obtenerProductosTipo(); //ok
  }

  ngOnInit() {}

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

  contar(){
    this.productoTipoSeleccionado=this.productosTipo.length;
  }

  actualizarTotalPedido() {
    this.pedido.totalPedido = this.pedido.productos.reduce(
      (total: number, producto: any) => {
        if (producto) {
          return total + producto.cantidad * producto.precio_unitario;
        }
        return total;
      },
      0
    );
  }

  crearPedido() {
     
    const datosPedido = {
      nombre: this.nombre,
      precio: this.precio,
      id_tipo: this.productoTipoSeleccionado || 16,
    };

   
    
    this.agregarPedido(datosPedido);
  }

  agregarDetallesPedido(producto: any, idpedido: number) {
    let productoAgregar = {
      id_pedido: idpedido,
      id_producto: +producto.id_producto,
      cantidad: producto.cantidad,
      nota: producto.nota,
      subtotal: producto.cantidad * producto.precio_unitario,
    };
    this.http.post<any>(`${HOST_DB}detalle`, productoAgregar).subscribe(
      (response) => {
        console.log('Detalle pedido creado exitosamente');
      },
      (error) => {
        console.error('Error al crear pedido:', error);
      }
    );
  }

  agregarPedido(datosPedido: any) {
    this.http.post<any>(`${HOST_DB}producto`, datosPedido).subscribe(
      (response) => {
        alert('Se agregó con exito!!!');
        console.log('Producto registrado exitosamente:', response);
        this.navigateTo('productos');
      },
      (error) => {
        console.error('Error al crear producto:', error);
      }
    );
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }
}
