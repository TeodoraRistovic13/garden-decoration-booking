import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdrzavanjaDekoraterComponent } from './odrzavanja-dekorater.component';

describe('OdrzavanjaDekoraterComponent', () => {
  let component: OdrzavanjaDekoraterComponent;
  let fixture: ComponentFixture<OdrzavanjaDekoraterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OdrzavanjaDekoraterComponent]
    });
    fixture = TestBed.createComponent(OdrzavanjaDekoraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
