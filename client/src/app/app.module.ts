import { NgModule,  NO_ERRORS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AgregarUsuariosComponent } from './usuarios/agregar-usuarios/agregar-usuarios.component';
import { VerUsuariosComponent } from './usuarios/ver-usuarios/ver-usuarios.component';
import { CrearPedidoComponent } from './pedidos/crear-pedido/crear-pedido.component';
import { LoginComponent } from './auth/login/login.component';
import { ProductosComponent } from './productos/productos.component';
import { AgregarProductoComponent } from './productos/agregar-producto/agregar-producto.component';
import { VerProductosComponent } from './productos/ver-productos/ver-productos.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { ClientesComponent } from './clientes/clientes.component';
import { AgregarClienteComponent } from './clientes/agregar-cliente/agregar-cliente.component';
import { VerClientesComponent } from './clientes/ver-clientes/ver-clientes.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PedidosComponent } from './pedidos/pedidos.component';
import { MesasComponent } from './mesas/mesas.component';
import { AgregarMesaComponent } from './mesas/agregar-mesa/agregar-mesa.component';
import { VerMesasComponent } from './mesas/ver-mesas/ver-mesas.component';
import { AgregarTipoProductoComponent } from './productos/agregar-tipo-producto/agregar-tipo-producto.component';
import { ModalComponent } from './modal/modal.component';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtInterceptorInterceptor } from './interceptors/auth.interceptor';
import { TablaPedidosComponent } from './tabla-pedidos/tabla-pedidos.component';
import { CocinasComponent } from './cocinas/cocinas.component';
import { VerPedidosComponent } from './pedidos/ver-pedidos/ver-pedidos.component';
import { FacturasComponent } from './registros/facturas/facturas.component';
import { VentasComponent } from './registros/ventas/ventas.component';
import { Cocina2Component } from './cocinas/cocina2/cocina2.component';
import { CocinamenuComponent } from './cocinas/cocinamenu/cocinamenu.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    UsuariosComponent,
    AgregarUsuariosComponent,
    VerUsuariosComponent,
    CrearPedidoComponent,
    LoginComponent,
    ProductosComponent,
    AgregarProductoComponent,
    VerProductosComponent,
    ConfiguracionComponent,
    ClientesComponent,
    AgregarClienteComponent,
    VerClientesComponent,
    PedidosComponent,
    MesasComponent,
    AgregarMesaComponent,
    VerMesasComponent,
    AgregarTipoProductoComponent,
    ModalComponent,
    TablaPedidosComponent,
    CocinasComponent,
    VerPedidosComponent,
    FacturasComponent,
    VentasComponent,
    Cocina2Component,
    CocinamenuComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: ['localhost:4200/login']
      }
    })
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true},
  ],
  
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
