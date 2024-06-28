import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMesasComponent } from './ver-mesas.component';

describe('VerMesasComponent', () => {
  let component: VerMesasComponent;
  let fixture: ComponentFixture<VerMesasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerMesasComponent]
    });
    fixture = TestBed.createComponent(VerMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
