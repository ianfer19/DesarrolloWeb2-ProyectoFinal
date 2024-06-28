import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocinamenuComponent } from './cocinamenu.component';

describe('CocinamenuComponent', () => {
  let component: CocinamenuComponent;
  let fixture: ComponentFixture<CocinamenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CocinamenuComponent]
    });
    fixture = TestBed.createComponent(CocinamenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
