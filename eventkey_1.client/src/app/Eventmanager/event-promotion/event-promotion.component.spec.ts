import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPromotionComponent } from './event-promotion.component';

describe('EventPromotionComponent', () => {
  let component: EventPromotionComponent;
  let fixture: ComponentFixture<EventPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventPromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
