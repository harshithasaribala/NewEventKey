import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventmanagerdashboardComponent } from './eventmanagerdashboard.component';

describe('EventmanagerdashboardComponent', () => {
  let component: EventmanagerdashboardComponent;
  let fixture: ComponentFixture<EventmanagerdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventmanagerdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventmanagerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
