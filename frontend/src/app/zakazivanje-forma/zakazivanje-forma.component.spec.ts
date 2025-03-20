import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZakazivanjeFormaComponent } from './zakazivanje-forma.component';

describe('ZakazivanjeFormaComponent', () => {
  let component: ZakazivanjeFormaComponent;
  let fixture: ComponentFixture<ZakazivanjeFormaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZakazivanjeFormaComponent]
    });
    fixture = TestBed.createComponent(ZakazivanjeFormaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
