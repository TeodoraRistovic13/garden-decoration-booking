import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistikaDekoraterComponent } from './statistika-dekorater.component';

describe('StatistikaDekoraterComponent', () => {
  let component: StatistikaDekoraterComponent;
  let fixture: ComponentFixture<StatistikaDekoraterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatistikaDekoraterComponent]
    });
    fixture = TestBed.createComponent(StatistikaDekoraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
