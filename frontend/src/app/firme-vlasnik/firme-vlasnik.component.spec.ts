import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmeVlasnikComponent } from './firme-vlasnik.component';

describe('FirmeVlasnikComponent', () => {
  let component: FirmeVlasnikComponent;
  let fixture: ComponentFixture<FirmeVlasnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirmeVlasnikComponent]
    });
    fixture = TestBed.createComponent(FirmeVlasnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
