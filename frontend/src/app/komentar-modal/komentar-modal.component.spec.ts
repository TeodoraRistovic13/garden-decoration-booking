import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KomentarModalComponent } from './komentar-modal.component';

describe('KomentarModalComponent', () => {
  let component: KomentarModalComponent;
  let fixture: ComponentFixture<KomentarModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KomentarModalComponent]
    });
    fixture = TestBed.createComponent(KomentarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
