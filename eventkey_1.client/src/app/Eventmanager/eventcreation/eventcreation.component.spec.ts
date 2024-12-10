import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcreationComponent } from './eventcreation.component';

describe('EventcreationComponent', () => {
  let component: EventcreationComponent;
  let fixture: ComponentFixture<EventcreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventcreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventcreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
