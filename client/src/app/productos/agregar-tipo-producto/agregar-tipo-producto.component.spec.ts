import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTipoProductoComponent } from './agregar-tipo-producto.component';

describe('AgregarTipoProductoComponent', () => {
  let component: AgregarTipoProductoComponent;
  let fixture: ComponentFixture<AgregarTipoProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarTipoProductoComponent]
    });
    fixture = TestBed.createComponent(AgregarTipoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
