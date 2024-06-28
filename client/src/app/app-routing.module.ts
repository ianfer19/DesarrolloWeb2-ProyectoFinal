import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { AgregarClienteComponent } from './clientes/agregar-cliente/agregar-cliente.component';
import { CrearPedidoComponent } from './pedidos/crear-pedido/crear-pedido.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ClientesComponent } from './clientes/clientes.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { CocinasComponent } from './cocinas/cocinas.component';
import { ProductosComponent } from './productos/productos.component';
import { RegistrosComponent } from './registros/registros.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { AgregarUsuariosComponent } from './usuarios/agregar-usuarios/agregar-usuarios.component';
import { MesasComponent } from './mesas/mesas.component';
import { AgregarMesaComponent } from './mesas/agregar-mesa/agregar-mesa.component';
import { VerUsuariosComponent } from './usuarios/ver-usuarios/ver-usuarios.component';
import { AgregarProductoComponent } from './productos/agregar-producto/agregar-producto.component';
import { VerProductosComponent } from './productos/ver-productos/ver-productos.component';
import { LoginComponent } from './auth/login/login.component';
import { GuardAuthGuard } from './guards/auth.guard';
import { TablaPedidosComponent } from './tabla-pedidos/tabla-pedidos.component';
import { VerPedidosComponent } from './pedidos/ver-pedidos/ver-pedidos.component';
import { FacturasComponent } from './registros/facturas/facturas.component';
import { VentasComponent } from './registros/ventas/ventas.component';
import { VerClientesComponent } from './clientes/ver-clientes/ver-clientes.component';
import { CocinamenuComponent } from './cocinas/cocinamenu/cocinamenu.component';
import { Cocina2Component } from './cocinas/cocina2/cocina2.component';
import { AgregarTipoProductoComponent } from './productos/agregar-tipo-producto/agregar-tipo-producto.component';
import { VerMesasComponent } from './mesas/ver-mesas/ver-mesas.component';
const routes: Routes = [
  { path: 'menu', canActivate: [GuardAuthGuard], component: MenuComponent },
  {
    path: 'usuarios',
    canActivate: [GuardAuthGuard],
    component: UsuariosComponent,
  },
  {
    path: 'clientes',
    canActivate: [GuardAuthGuard],
    component: ClientesComponent,
  },
  {
    path: 'administrar/pedidos',
    canActivate: [GuardAuthGuard],
    component: VerPedidosComponent,
  },
  {
    path: 'tablapedidos',
    canActivate: [GuardAuthGuard],
    component: TablaPedidosComponent,
  },
  {
    path: 'cocinas',
    canActivate: [GuardAuthGuard],
    component: CocinasComponent,
  },
  {
    path: 'cocinasMenu',
    canActivate: [GuardAuthGuard],
    component: CocinamenuComponent,
  },
  {
    path: 'cocinas2',
    canActivate: [GuardAuthGuard],
    component: Cocina2Component,
  },
  { path: 'mesas', canActivate: [GuardAuthGuard], component: MesasComponent },
  {
    path: 'productos',
    canActivate: [GuardAuthGuard],
    component: ProductosComponent,
  },
  {
    path: 'registros',
    canActivate: [GuardAuthGuard],
    component: RegistrosComponent,
  },
  {
    path: 'registro/ventas',
    canActivate: [GuardAuthGuard],
    component: VentasComponent,
  },
  {
    path: 'registros/facturas',
    canActivate: [GuardAuthGuard],
    component: FacturasComponent,
  },
  {
    path: 'configuracion',
    canActivate: [GuardAuthGuard],
    component: ConfiguracionComponent,
  },
  {
    path: 'pedidos',
    canActivate: [GuardAuthGuard],
    component: CrearPedidoComponent,
  },
  {
    path: 'agregar/cliente',
    canActivate: [GuardAuthGuard],
    component: AgregarClienteComponent,
  },
  {
    path: 'agregar/usuario',
    canActivate: [GuardAuthGuard],
    component: AgregarUsuariosComponent,
  },
  {
    path: 'agregar/mesa',
    canActivate: [GuardAuthGuard],
    component: AgregarMesaComponent,
  },
  {
    path: 'administrar/usuario',
    canActivate: [GuardAuthGuard],
    component: VerUsuariosComponent,
  },
  {
    path: 'administrar/clientes',
    canActivate: [GuardAuthGuard],
    component: VerClientesComponent,
  },
  {
    path: 'administrar/mesas',
    canActivate: [GuardAuthGuard],
    component: VerMesasComponent,
  },
  {
    path: 'administrar/producto',
    canActivate: [GuardAuthGuard],
    component: VerProductosComponent,
  },
  {
    path: 'agregar/producto',
    canActivate: [GuardAuthGuard],
    component: AgregarProductoComponent,
  },
  {
    path: 'agregar/productos_tipo',
    canActivate: [GuardAuthGuard],
    component: AgregarTipoProductoComponent,
  },
  { path: 'login', component: LoginComponent },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/menu',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}