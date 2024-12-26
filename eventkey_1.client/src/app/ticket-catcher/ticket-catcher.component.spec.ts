import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCatcherComponent } from './ticket-catcher.component';

describe('TicketCatcherComponent', () => {
  let component: TicketCatcherComponent;
  let fixture: ComponentFixture<TicketCatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketCatcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketCatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
