import { TestBed } from '@angular/core/testing';

import { DetallesPedidoService } from './detalles-pedido.service';

describe('DetallesPedidoService', () => {
  let service: DetallesPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetallesPedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
