import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZakazivanjeDetaljiComponent } from './zakazivanje-detalji.component';

describe('ZakazivanjeDetaljiComponent', () => {
  let component: ZakazivanjeDetaljiComponent;
  let fixture: ComponentFixture<ZakazivanjeDetaljiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZakazivanjeDetaljiComponent]
    });
    fixture = TestBed.createComponent(ZakazivanjeDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
