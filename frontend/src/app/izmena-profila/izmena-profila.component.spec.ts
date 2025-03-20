import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmenaProfilaComponent } from './izmena-profila.component';

describe('IzmenaProfilaComponent', () => {
  let component: IzmenaProfilaComponent;
  let fixture: ComponentFixture<IzmenaProfilaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IzmenaProfilaComponent]
    });
    fixture = TestBed.createComponent(IzmenaProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
