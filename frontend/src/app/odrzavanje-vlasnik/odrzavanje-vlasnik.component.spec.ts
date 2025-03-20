import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdrzavanjeVlasnikComponent } from './odrzavanje-vlasnik.component';

describe('OdrzavanjeVlasnikComponent', () => {
  let component: OdrzavanjeVlasnikComponent;
  let fixture: ComponentFixture<OdrzavanjeVlasnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OdrzavanjeVlasnikComponent]
    });
    fixture = TestBed.createComponent(OdrzavanjeVlasnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
