import { Component, Inject, OnInit } from '@angular/core';
import { RegistrosService } from '../../services/registros/registros.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  registros: any[] = [];
  total: number = 0;
  nequi: number = 0;
  bancolombia: number = 0;
  efectivo: number = 0;
  selectedConsulta: string = 'getTotal';
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  fechaFinTotal: Date = new Date();

  constructor(private router: Router, private registrosService: RegistrosService, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.obtenerDatos();
    this.document.documentElement.classList.add('black-bg');
  }
  formatoFecha(fecha: Date): string {
    const año = fecha.getUTCFullYear();
    let mes: string | number = fecha.getUTCMonth() + 1;
    let dia: string | number = fecha.getUTCDate();
  
    // Ajustar formato si es necesario (agregar ceros)
    if (mes < 10) {
      mes = '0' + mes;
    }
    if (dia < 10) {
      dia = '0' + dia;
    }
  
    return `${año}-${mes}-${dia}`;
  }
  
  obtenerDatos(): void {
    // Convertir la fecha de string a Date
    const fechaInicioDate = new Date(this.fechaInicio);
    const fechaFinDate = new Date(this.fechaFin);
    const fechaInicioFormateada = this.formatoFecha(fechaInicioDate);
    const fechaFinFormateada = this.formatoFecha(fechaFinDate);
    switch (this.selectedConsulta) {
      case 'getTotal':
        this.registrosService.getTotal(this.fechaInicio,this.fechaFin).subscribe(data => {
          console.log(fechaFinFormateada, fechaInicioFormateada, data)
          this.total = data.total;
          this.nequi = data.nequi;
          this.bancolombia = data.bancolombia;
          this.efectivo = data.efectivo;
        });
        break;
      case 'getTotalTipo':
        this.registrosService.getTotalTipo(fechaInicioFormateada, fechaFinFormateada).subscribe(data => {
          console.log(fechaFinFormateada, fechaInicioFormateada, data)
          this.registros = data;
          this.total = data.total;
        });
        break;
      case 'getTotalProducto':
        this.registrosService.getTotalProducto(fechaInicioFormateada, fechaFinFormateada).subscribe(data => {
          this.registros = data;
          this.total = data.total;
        });
        break;
      case 'getTotalMesa':
        this.registrosService.getTotalMesa(fechaInicioFormateada, fechaFinFormateada).subscribe(data => {
          this.registros = data;
          this.total = data.total;
        });
        break;
      case 'getTotalTipoPedido':
        this.registrosService.getTotaltipoPedido(fechaInicioFormateada, fechaFinFormateada).subscribe(data => {
          this.registros = data;
          this.total = data.total;
        });
        break;
      default:
        break;
    }
  }
  
  navigateTo(route: string) {
    // Aquí puedes implementar la navegación a cada sección según la lógica de tu aplicación
    this.router.navigateByUrl(route);
    console.log(`Navegar a la sección: ${route}`);
  }
}
