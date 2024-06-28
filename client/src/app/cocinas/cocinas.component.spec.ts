import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocinasComponent } from './cocinas.component';

describe('CocinasComponent', () => {
  let component: CocinasComponent;
  let fixture: ComponentFixture<CocinasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CocinasComponent]
    });
    fixture = TestBed.createComponent(CocinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
