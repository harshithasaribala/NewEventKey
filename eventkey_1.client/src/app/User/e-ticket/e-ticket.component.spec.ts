import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETicketComponent } from './e-ticket.component';

describe('ETicketComponent', () => {
  let component: ETicketComponent;
  let fixture: ComponentFixture<ETicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ETicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ETicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
