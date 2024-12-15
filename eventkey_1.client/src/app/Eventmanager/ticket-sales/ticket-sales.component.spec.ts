import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSalesComponent } from './ticket-sales.component';

describe('TicketSalesComponent', () => {
  let component: TicketSalesComponent;
  let fixture: ComponentFixture<TicketSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
