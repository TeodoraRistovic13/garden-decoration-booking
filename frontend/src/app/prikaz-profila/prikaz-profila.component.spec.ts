import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrikazProfilaComponent } from './prikaz-profila.component';

describe('PrikazProfilaComponent', () => {
  let component: PrikazProfilaComponent;
  let fixture: ComponentFixture<PrikazProfilaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrikazProfilaComponent]
    });
    fixture = TestBed.createComponent(PrikazProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
