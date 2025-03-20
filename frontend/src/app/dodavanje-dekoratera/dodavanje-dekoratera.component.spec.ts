import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeDekorateraComponent } from './dodavanje-dekoratera.component';

describe('DodavanjeDekorateraComponent', () => {
  let component: DodavanjeDekorateraComponent;
  let fixture: ComponentFixture<DodavanjeDekorateraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DodavanjeDekorateraComponent]
    });
    fixture = TestBed.createComponent(DodavanjeDekorateraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
