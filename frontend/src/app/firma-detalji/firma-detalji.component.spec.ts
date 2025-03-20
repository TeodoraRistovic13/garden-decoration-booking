import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaDetaljiComponent } from './firma-detalji.component';

describe('FirmaDetaljiComponent', () => {
  let component: FirmaDetaljiComponent;
  let fixture: ComponentFixture<FirmaDetaljiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirmaDetaljiComponent]
    });
    fixture = TestBed.createComponent(FirmaDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
