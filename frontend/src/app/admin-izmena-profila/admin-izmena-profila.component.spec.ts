import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIzmenaProfilaComponent } from './admin-izmena-profila.component';

describe('AdminIzmenaProfilaComponent', () => {
  let component: AdminIzmenaProfilaComponent;
  let fixture: ComponentFixture<AdminIzmenaProfilaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminIzmenaProfilaComponent]
    });
    fixture = TestBed.createComponent(AdminIzmenaProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
