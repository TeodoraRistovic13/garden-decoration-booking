import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZakazivanjaDekoraterComponent } from './zakazivanja-dekorater.component';

describe('ZakazivanjaDekoraterComponent', () => {
  let component: ZakazivanjaDekoraterComponent;
  let fixture: ComponentFixture<ZakazivanjaDekoraterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZakazivanjaDekoraterComponent]
    });
    fixture = TestBed.createComponent(ZakazivanjaDekoraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
