import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeedbackComponent } from './view-feedback.component';

describe('ViewFeedbackComponent', () => {
  let component: ViewFeedbackComponent;
  let fixture: ComponentFixture<ViewFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
