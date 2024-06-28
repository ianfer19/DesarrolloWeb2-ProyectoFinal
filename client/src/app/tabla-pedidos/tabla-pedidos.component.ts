import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from '../services/Pedido/pedido.service';
import { DetallesPedidoService } from '../services/DetallesPedido/detalles-pedido.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FacturaService } from '../services/Factura/factura.service';
import { HOST_DB } from '../constans';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ProductoPedido {
  id_producto?: number;
  id_tipo?: number;
  nombre?: string;
  cantidad?: number;
  precio_unitario?: number;
  nota?: String;
}

interface Factura {
  id_factura:number;
  id_pedido: number;
  fecha_factura: Date;
  id_empleado: number
  total_factura:number;
  fechaeliminacion:Date;
}

@Component({
  selector: 'app-tabla-pedidos',
  templateUrl: './tabla-pedidos.component.html',
  styleUrls: ['./tabla-pedidos.component.css'],
})
export class TablaPedidosComponent implements OnInit {
[x: string]: any;
  pedidos: any[] = [];
  detallesPedido: { [key: number]: any[] } = {}; // Mapa de pedidos a detalles
  pedidosForm!: FormGroup;
  showModal: boolean = false;
  editedPedido: any | null = null;
  detallesPedidoForm!: FormGroup;
  modal2Visible: boolean = false;
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
  pedidoEdit: any[] = [];
  pedidoSeleccionado: any;
  showModalFacturar: any;
  showModalFacturar2: any;
  detallesPedidoSeleccionado: any[] = [];
  facturaEditar: any []=[];
  facturaEditarForm!: FormGroup;
  idFacturaEditar: number | undefined;
  totalFacturaEditar: number | undefined;
  mesas: any[] = [];
  Facturas: Factura[] = [];
  editarTemplateVisible: boolean = false;
eliminarTemplateVisible: boolean = false;


  product: ProductoPedido = {
    id_producto: 0,
    id_tipo: 0,
    nombre: '',
    cantidad: 0,
    precio_unitario: 0,
    nota: '',
  };
  pedido = {
    idCliente: null,
    idMesa: null,
    fechaPedido: new Date().toISOString(),
    tipoPedido: '',
    totalPedido: 0,
    productos: [] as ProductoPedido[],
    idEmpleado: null, // Agregamos el campo idEmpleado para almacenar el ID del usuario que atiende el pedido
  };
  facturaForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private pedidoService: PedidoService,
    private detallesPedidoService: DetallesPedidoService,
    private fb: FormBuilder,
    private jwtHelper: JwtHelperService,
    private facturaService: FacturaService
  ) {
    this.obtenerMesas(); //ok
    console.log(this.mesas);
    this.obtenerProductosTipo(); //ok
    this.obtenerProductos(); //ok
    this.getUsuarioIdFromToken();
  }

  ngOnInit() {
    this.leerPedidos();
    this.pedidosForm = this.fb.group({
      id: [''],
      id_cliente: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      tipo_pedido: [],
      id_mesa: [],
      fecha_pedido: [],
      total_pedido: [],
      nombre_cliente: [],
      estado: [],
    });
    this.detallesPedidoForm = this.fb.group({
      id: [''],
      id_pedido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      id_producto: [],
      cantidad: [],
      nota: [],
      subtotal: [],
      fechaeliminacion: [],
    });
    this.facturaForm = this.fb.group({
      id: [''],
      id_pedido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      fecha_factura: [],
      id_empleado: [],
      descuento_por: [],
      adescuento_por: [],
      total_factura:[],
      nequi:[],
      bancolombia:[],
      efectivo:[]
    });
    this.facturaEditarForm= this.fb.group({
      nequi:[],
      bancolombia: [],
      efectivo: []
    });
    this.pedidoService.observeNewPedidosEmpleados().subscribe(
      (newPedidos) => {
        this.pedidos = newPedidos;
        this.pedidos.forEach((pedido) => {
          this.leerDetallePedido(pedido.id_pedido); // Pasar el id del pedido a la función leerDetallePedido
        });
      },
      (error) => {
        console.error('Error al observar nuevos pedidos:', error);
      }
    );
    
    this.obtenerMesas();
    this.obtenerFacturas();
    
  }


  obtenerFacturas(){
    this.facturaService.getFacturas().subscribe(
      (data)=>{
        this.Facturas = data;
        console.log(this.Facturas)
      }, 
      (error) => {
        console.log('error al obtener las facturas')
      }
    )
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

  filtrarFacturasPorPedido(idPedido: number): any {
    return this.Facturas.filter(factura => factura.id_pedido === idPedido);
  }

  nombreMesa(id:number){
    const mesa=this.mesas.find(mesa=>mesa.id=id)[0]
    return mesa.nombre;
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }

  leerPedidos() {
    this.pedidoService.getPedidosEmpleados().subscribe(
      (data) => {
        this.pedidos = data;
        // Iterar sobre los pedidos y obtener los detalles de cada pedido
        this.pedidos.forEach((pedido) => {
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

  leerDetallePedidoSeleccionado(id: number): void {
    console.log(id);
    this.detallesPedidoService.getDetallesPedidoByIdPedido(id).subscribe(
      (data) => {
        this.detallesPedidoSeleccionado = data; // Almacenar detalles en el mapa con el ID del pedido como clave
        console.log(this.detallesPedidoSeleccionado);
      },
      (error) => {
        console.error('Error al obtener detalles del pedido por ID:', error);
      }
    );
  }

  marcarComoFacturado(form: FormGroup) {
    const id = form.value.id;
    form.patchValue({ estado: 2 });
    console.log(form.value);
    this.pedidoService.actualizarPedido(id, form.value).subscribe(
      (data) => {
        this.refresh();
      },
      (error) => {
        console.error('Error al terminar el pedido:', error);
      }
    );
  }

  marcarComoPagado(form: FormGroup) {
    const id = form.value.id;
    console.log(form.value);
    this.pedidoService.eliminarPedido(id).subscribe(
      (data) => {
        this.marcarComoFacturado(form);
        this.refresh();
      },
      (error) => {
        console.error('Error al terminar el pedido:', error);
      }
    );
  }

  marcarComoEliminado(form: FormGroup) {
    const id = form.value.id;
    form.patchValue({ estado: 3 });
    console.log(form.value);
    this.pedidoService.actualizarPedido(id, form.value).subscribe(
      (data) => {
        alert('Se eliminó con exito!!!');
        this.refresh();
      },
      (error) => {
        console.error('Error al terminar el pedido:', error);
      }
    );
  }

  sumarTotal(pedidoEdit: any, total: number) {
    const id = pedidoEdit.id;

    // Convertir pedidoEdit.total_pedido a número
    let totalPedido: number = parseFloat(pedidoEdit.total_pedido);

    // Verificar si la conversión fue exitosa
    if (!isNaN(totalPedido)) {
      // Sumar el total al total_pedido convertido
      totalPedido += total;

      // Actualizar el total_pedido en el objeto pedidoEdit
      pedidoEdit.total_pedido = totalPedido;

      this.pedidoService.actualizarPedido(id, pedidoEdit).subscribe(
        (data) => {
          this.refresh();
        },
        (error) => {
          console.error('Error al terminar el pedido:', error);
        }
      );
    } else {
      console.error('Error al convertir total_pedido a número');
    }
  }

  restarTotal(pedidoEdit: any, detallesPedidoEdit: any) {
    const id = pedidoEdit.value.id;
    let idDetalle: number = parseFloat(detallesPedidoEdit.value.id);
    let totalPedido: number = parseFloat(detallesPedidoEdit.value.subtotal);
    let totalPedidoEnv: number = parseFloat(pedidoEdit.value.total_pedido);

    if (!isNaN(totalPedido)) {
      // Mostrar un alert
      const confirmar = confirm('¿Estás seguro de eliminar este producto?');

      // Continuar solo si el usuario acepta
      if (confirmar) {
        totalPedidoEnv -= totalPedido;
        pedidoEdit.value.total_pedido = totalPedidoEnv;
        this.pedidoService.actualizarPedido(id, pedidoEdit.value).subscribe(
          (data) => {
            console.log('Pedido actualizado correctamente:', data);
            this.eliminarDetallePedido(idDetalle);
            console.log(detallesPedidoEdit.value);
            this.refresh(); // Ejemplo: refrescar datos después de actualizar el pedido.
          },
          (error) => {
            console.error('Error al terminar el pedido:', error);
          }
        );
      }
    } else {
      console.error('Error al convertir total_pedido a número');
    }
  }

  editar(datos: {
    id_cliente: any;
    nombre_cliente: any;
    tipo_pedido: any;
    id_mesa: any;
    total_pedido: any;
    fecha_pedido: any;
    id_pedido: any;
    estado: any;
  }) {
    this.pedidosForm.setValue({
      id_cliente: datos.id_cliente,
      tipo_pedido: datos.tipo_pedido,
      id_mesa: datos.id_mesa,
      fecha_pedido: datos.fecha_pedido,
      total_pedido: datos.total_pedido,
      estado: datos.estado,
      nombre_cliente: datos.nombre_cliente,
      id: datos.id_pedido,
    });
  }


  editarFactura(datos: {id: any, id_pedido:any, fecha_factura:any, id_empleado:any, descuento_por:any, adescuento_por:any, total_factura:any, fechaeliminacion:any, 
                  nequi:any, bancolombia: any, efectivo:any}) {
    this.facturaForm.setValue({
      id: datos.id,
      id_pedido: datos.id_pedido,
      fecha_factura: datos.fecha_factura,
      id_empleado: datos.id_empleado,
      descuento_por: datos.descuento_por,
      adescuento_por: datos.adescuento_por,
      total_factura: datos.total_factura,
      nequi: datos.nequi,
      bancolombia: datos.bancolombia,
      efectivo: datos.efectivo
    });
  }

  editarFacturaPago(datos:{id_pedido: any, nequi:any, bancolombia: any, efectivo: any}){
    this.facturaEditarForm.setValue({
      id_pedido: datos.id_pedido,
      nequi: datos.nequi,
      bancolombia: datos.bancolombia,
      efectivo: datos. efectivo
    })
  }



  editarDetallesPedidos(datos: { id: any; id_pedido: any; id_producto: any;  cantidad: any, nota:any, subtotal: any; fechaeliminacion: any}) {
    this.detallesPedidoForm.setValue({
      id: datos.id,
      id_pedido: datos.id_pedido,
      id_producto: datos.id_producto,
      cantidad: datos.cantidad,
      nota: datos.nota,
      subtotal: datos.subtotal,
      fechaeliminacion: datos.fechaeliminacion,
    });
  }

  eliminarDetallePedido(id: number) {
    console.log(id);
    this.detallesPedidoService.eliminarDetallePedido(id).subscribe(
      (data) => {
        alert('Se eliminó con exito!!!');
        this.refresh();
      },
      (error) => {
        console.error('Error al terminar el pedido:', error);
      }
    );
  }

  refresh() {
    this.pedidoService.getPedidos().subscribe((datos) => {
      this.pedidos = datos;
    });
  }

  cancelarEdicion() {
    this.editedPedido = null;
    this.showModal=false;
    this.modal2Visible=false;
    this.showModalFacturar= false;
    this.showModalFacturar2= false;
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
    console.log(int);
    const productosFiltrados = this.productos.filter(
      (element) => element.id == int
    );
    console.log(productosFiltrados);
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
    this.actualizarTotalPedido();
    this.notaPedido = ''; //limpiamos
    this.cantidadProducto = 1;
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

  agregarPedido(form: FormGroup) {
    this.pedidoEdit = form.value;
    try {
      const id = form.value.id;
      this.pedido.productos.forEach((producto) => {
        this.agregarDetallesPedido(producto, id);
        this.sumarTotal(this.pedidoEdit, this.pedido.totalPedido);
      });
      alert('Se agregaron con exito!!!');
    } catch (error) {
      console.error('Error al agregar pedido:', error);
    }
  }

  imprimirFactura(form: FormGroup) {
    // Obtener los datos del formulario
    const id_pedido = form.value.id;
    console.log(form.value);
    const id = this.getUsuarioIdFromToken();

    // Agregar los datos al formulario de la factura
    this.facturaForm.setValue({
      id: '',
      id_pedido: id_pedido,
      fecha_factura: new Date(),
      id_empleado: id,
      total_factura: form.value.total_pedido,
      descuento_por: 0,
      adescuento_por: 0,
      nequi : parseInt((<HTMLInputElement>document.getElementById('nequiInput')).value),
      bancolombia : parseInt((<HTMLInputElement>document.getElementById('bancolombiaInput')).value),
      efectivo : parseInt((<HTMLInputElement>document.getElementById('efectivoInput')).value)
    });
    const nequi = parseInt((<HTMLInputElement>document.getElementById('nequiInput')).value);
    const bancolombia = parseInt((<HTMLInputElement>document.getElementById('bancolombiaInput')).value);
    const efectivo = parseInt((<HTMLInputElement>document.getElementById('efectivoInput')).value);
    const facturaTotal = form.value.total_pedido;
    if(this.facturaForm.value.nequi === null){
      form.patchValue({ nequi: 0 });
    }
    if(this.facturaForm.value.bancolombia === null){
      form.patchValue({ bancolombia: 0 });
    }
    if(this.facturaForm.value.efectivo === null){
      form.patchValue({ efectivo: 0 });
    }


    console.log(nequi, bancolombia, efectivo, facturaTotal)
      this.facturaService.crearFactura(this.facturaForm.value).subscribe(
        (response) => {
          console.log('Factura creada exitosamente:', response);
          let facturaHTML = `
          FACTURA
            ID Pedido: ${response.factura.id_pedido}
            Fecha: ${response.factura.fecha_factura}
            Empleado: ${response.factura.id_empleado}
            Total: ${response.factura.total_factura}
            Nequi: ${response.factura.nequi}
            Bancolombia: ${response.factura.bancolombia}
            Efectivo: ${response.factura.efectivo}

            PEDIDO
            Cliente: ${response.id_cliente}
            ID Pedido: ${response.pedido.id_pedido}
            ID_mesa: ${response.pedido.id_mesa}
            Total: ${response.pedido.total_pedido}
            Tipo pedido: ${response.pedido.tipo_pedido}

            `;

            // Agregar sección para los detalles del pedido
            facturaHTML += `Detalles del Pedido`;
            response.detalles_pedido.forEach((detalle: { id_producto: any; cantidad: any; precio_unitario: any; subtotal: any; }) => {
              facturaHTML += `
                ID Producto: ${detalle.id_producto}
                Cantidad: ${detalle.cantidad}
                Precio Unitario: ${detalle.precio_unitario}
                Subtotal: ${detalle.subtotal}
              `;
            });

            const facturanombre= 'Factura-' + response.id_cliente +'-Pedido:'+response.pedido.id_pedido;

    
        // Convertir HTML a PDF usando jsPDF y html2canvas
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.text(facturaHTML, 10, 10); // Colocar el contenido HTML en el PDF
        pdf.save(facturanombre);


          // Eliminar el pedido si la factura se crea correctamente
          this.pedidoService.eliminarPedido(id_pedido).subscribe(
            (data) => {
              console.log('Pedido facturado correctamente:', data);
              alert("Se facturó correctamente el pedido");
                      // Generar contenido HTML para la factura

              this.refresh();
            },
            (error) => {
              console.error('Error al facturar el pedido:', error);
              // Manejar el error al eliminar el pedido
            }
          );
        },
        (error) => {
          console.error('Error al crear la factura:', error);
          // Manejar el error al crear la factura
        }
      );  
    console.log(this.facturaForm.value);
  }

  getUsuarioIdFromToken() {
    const token: string | null = localStorage.getItem('token');
    const tokenString: string = token ? String(token) : '';
    try {
      const decodedToken: any = this.jwtHelper.decodeToken(tokenString);
      console.log(decodedToken)
      return decodedToken.id;
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }

  limpiarModal(): void {
    // Limpiar campos o reiniciar variables necesarias
    this.productoTipoSeleccionado = null;
    this.productoSeleccionado = null;
    this.cantidadProducto = 0;
    this.notaPedido = '';
    this.pedido.productos = []; // O cualquier otra lógica para reiniciar los productos seleccionados
    this.pedido.totalPedido = 0;
    this.detallesPedidoSeleccionado = [];
  }

  abrirModalFacturar(pedido: any) {
    this.pedidoSeleccionado = pedido; 
    this.showModalFacturar = true;
  }

  idFactura(id:number, totalFactura: number){
    this.idFacturaEditar= id;
    this.totalFacturaEditar = totalFactura;
    console.log(this.idFacturaEditar)
  }

  editarPago(form: FormGroup) {
    const id = this.idFacturaEditar;
    console.log(this.idFacturaEditar);
  
    // Validación y conversión de valores nulos a 0
    const nequi = form.value.nequi;
    const bancolombia = form.value.bancolombia;
    const efectivo = form.value.efectivo;
    if(form.value.nequi === null){
      form.patchValue({ nequi: 0 });
    }
    if(form.value.bancolombia === null){
      form.patchValue({ bancolombia: 0 });
    }
    if(form.value.efectivo === null){
      form.patchValue({ efectivo: 0 });
    }
    console.log(nequi, bancolombia, efectivo);
    console.log(form.value);
  
    if (efectivo + bancolombia + nequi == this.totalFacturaEditar) {
      this.facturaService.actualizarPagoFactura(id, form.value).subscribe(
        data => {
          alert("Se ha actualizado correctamente los métodos de pago de la factura " + id);
          this.refresh();
        },
        error => {
          console.error('Error al actualizar los métodos de pago de la factura');
        }
      );
    } else {
      alert("El total ingresado no coincide con el total de la factura");
    }
  }
  
  
}
