import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cocina2Component } from './cocina2.component';

describe('Cocina2Component', () => {
  let component: Cocina2Component;
  let fixture: ComponentFixture<Cocina2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Cocina2Component]
    });
    fixture = TestBed.createComponent(Cocina2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
