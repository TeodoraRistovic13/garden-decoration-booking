import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZakazivanjaVlasnikComponent } from './zakazivanja-vlasnik.component';

describe('ZakazivanjaVlasnikComponent', () => {
  let component: ZakazivanjaVlasnikComponent;
  let fixture: ComponentFixture<ZakazivanjaVlasnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZakazivanjaVlasnikComponent]
    });
    fixture = TestBed.createComponent(ZakazivanjaVlasnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
