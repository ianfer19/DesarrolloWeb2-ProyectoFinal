import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HOST_DB } from 'src/app/constans';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DetallesPedidoService } from 'src/app/services/DetallesPedido/detalles-pedido.service';
import { ModalComponent } from 'src/app/modal/modal.component';

interface ProductoPedido {
  id_producto?: number;
  id_tipo?: number;
  nombre?: string;
  cantidad?: number;
  estado?:string;
  precio_unitario?: number;
  nota?: String;
}

interface datosPedido {
  id_user: number;
  id_mesa: number;
  tipo: String;
}

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.css'],
})
export class CrearPedidoComponent {
  pedido = {
    idCliente: null,
    idMesa: null,
    fechaPedido: new Date().toISOString(),
    tipoPedido: '',
    totalPedido: 0,
    productos: [] as ProductoPedido[],
    idEmpleado: null, // Agregamos el campo idEmpleado para almacenar el ID del usuario que atiende el pedido
  };

  product: ProductoPedido = {
    id_producto: 0,
    id_tipo: 0,
    nombre: '',
    cantidad: 0,
    estado:'',
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
  notaPedido: String | null = '';
  disableCliente = false;
  disableMesa = false;
  disableUSer = false;
  disableTipoPedido = false;
  localIP = '';
  showModalCrearPedido= false;

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService, private detallesService: DetallesPedidoService) {
    this.obtenerClientes(); //ok
    this.obtenerMesas(); //ok
    this.obtenerUsuarios(); // falta fijar
    this.obtenerProductosTipo(); //ok
    this.obtenerProductos(); //ok
  }

  ngOnInit() {
  }

  obtenerClientes() {
    this.http.get<any[]>(`${HOST_DB}cliente`).subscribe(
      (response) => {
        this.clientes = response;
      },
      (error) => {
        console.error('Error al obtener clientes:', error);
      }
    );
  }

  cancelarEdicion() {
    this.showModalCrearPedido = false;
  }

  obtenerMesas() {
    this.http.get<any[]>(`${HOST_DB}mesa`).subscribe(
      (response) => {
        this.mesas = response;
      },
      (error) => {
        console.error('Error al obtener mesas:', error);
      }
    );
  }
  obtenerUsuarios() {
    this.http.get<any[]>(`${HOST_DB}usuario`).subscribe(
      (response) => {
        this.usuarios = response;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
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
  obtenerProductos() {
    this.http.get<any[]>(`${HOST_DB}producto`).subscribe(
      (response) => {
        this.productos = response;
        console.log(this.productos)
      },
      (error) => {
        console.error('Error al obtener tipos de productos:', error);
      }
    );
  }

  //filtra productos por tipo
  filtrarProductos(id_tipoo: number | null) {
    if (this.productoTipoSeleccionado !== null) {
      this.productosMostrar = this.productos.filter((producto) => {
        if (producto.id_tipo == id_tipoo) {
          return producto;
        }
      });
    }
  }

  DatosProductoPorId(int: number | null) {
    console.log(this.productos)
    const productosFiltrados = this.productos.filter(
      (element) => element.id == int
    );
    console.log(productosFiltrados.length)
    if (productosFiltrados.length > 0) {
      const { nombre, precio } = productosFiltrados[0];
      this.product.nombre = nombre;
      this.product.precio_unitario = parseFloat(precio);
    } else {
      console.error('No se encontró ningún producto con el ID proporcionado');
    }
  }

  nombreTipoSeleccionado(int: number | undefined) {
    const producto = this.productosTipo.filter(
      (element) => element.id_producto_tipo == int
    )[0].nombre;

    return producto;
  }

  eliminarProducto(index: number) {
    this.pedido.productos.splice(index, 1);
    this.actualizarTotalPedido(); // Actualiza el total del pedido después de eliminar un producto
  }

  //terminar
  agregarProducto() {
    //verificamos que estan los campos necesarios
    if (true) {
      let pro = {
        id_producto: this.productoSeleccionado || 0,
        id_tipo: this.productoTipoSeleccionado || 0,
        nombre: this.product.nombre,
        cantidad: this.cantidadProducto || 0,
        precio_unitario: this.product.precio_unitario,
        nota: this.notaPedido || '',
      };
      this.pedido.productos.push(pro);
    } else {
      //alerta de que falta algo en esa mondá
    }
    this.actualizarTotalPedido(); //actualizamos el valor
    this.notaPedido = ''; //limpiamos
    this.cantidadProducto = 1;
    console.log(this.pedido);
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
    const id = this.getUsuarioIdFromToken();
    console.log(id)
    const datosPedido = {
      id_cliente: this.pedido.idCliente,
      id_mesa: this.pedido.idMesa,
      fecha_pedido: this.pedido.fechaPedido,
      tipo_pedido: this.pedido.tipoPedido,
      total_pedido: this.pedido.totalPedido,
      id_usuario: id
    };
    this.agregarPedido(datosPedido);
  }

  agregarDetallesPedido(producto: any, idpedido: number) {
    let productoAgregar = {
      id_pedido: idpedido,
      id_producto: +producto.id_producto,
      cantidad: producto.cantidad,
      estado: "IMPRESO",
      nota: producto.nota,
      subtotal: producto.cantidad * producto.precio_unitario,
    };
    console.log(productoAgregar)
    this.http.post<any>(`${HOST_DB}detalles-pedido`, productoAgregar).subscribe(
      (response) => {
        console.log('Detalle pedido creado exitosamente');
      },
      (error) => {
        console.error('Error al crear pedido:', error);
      }
    );
  }


  agregarPedido(datosPedido: any) {
    this.http.post<any>(`${HOST_DB}pedido`, datosPedido).subscribe(
      (response) => {
        this.pedido.productos.forEach((producto) => {
          this.agregarDetallesPedido(producto, response.id_pedido);
        });
        alert('Se agregó con éxito!!!');
      },
      (error) => {
        console.error('Error al crear pedido:', error);
      }
    );
  }
  
  getUsuarioIdFromToken() {
    const token: string | null = localStorage.getItem('token');
    const tokenString: string = token ? String(token) : '';
    try {
      const decodedToken: any = this.jwtHelper.decodeToken(tokenString);
      return decodedToken._id;
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }
}
