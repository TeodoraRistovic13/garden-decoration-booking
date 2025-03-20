import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KomentarOdbijenicaModalComponent } from './komentar-odbijenica-modal.component';

describe('KomentarOdbijenicaModalComponent', () => {
  let component: KomentarOdbijenicaModalComponent;
  let fixture: ComponentFixture<KomentarOdbijenicaModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KomentarOdbijenicaModalComponent]
    });
    fixture = TestBed.createComponent(KomentarOdbijenicaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
