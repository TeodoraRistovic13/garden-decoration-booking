import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeFirmeComponent } from './dodavanje-firme.component';

describe('DodavanjeFirmeComponent', () => {
  let component: DodavanjeFirmeComponent;
  let fixture: ComponentFixture<DodavanjeFirmeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DodavanjeFirmeComponent]
    });
    fixture = TestBed.createComponent(DodavanjeFirmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
