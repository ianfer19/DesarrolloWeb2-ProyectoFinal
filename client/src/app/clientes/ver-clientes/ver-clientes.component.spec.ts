import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerClientesComponent } from './ver-clientes.component';

describe('VerClientesComponent', () => {
  let component: VerClientesComponent;
  let fixture: ComponentFixture<VerClientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerClientesComponent]
    });
    fixture = TestBed.createComponent(VerClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
