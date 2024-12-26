import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBookingInsightsComponent } from './event-booking-insights.component';

describe('EventBookingInsightsComponent', () => {
  let component: EventBookingInsightsComponent;
  let fixture: ComponentFixture<EventBookingInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventBookingInsightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventBookingInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
