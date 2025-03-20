import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeautorizovanPristupComponent } from './neautorizovan-pristup.component';

describe('NeautorizovanPristupComponent', () => {
  let component: NeautorizovanPristupComponent;
  let fixture: ComponentFixture<NeautorizovanPristupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeautorizovanPristupComponent]
    });
    fixture = TestBed.createComponent(NeautorizovanPristupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
