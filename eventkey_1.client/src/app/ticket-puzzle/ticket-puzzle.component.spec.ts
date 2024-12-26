import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPuzzleComponent } from './ticket-puzzle.component';

describe('TicketPuzzleComponent', () => {
  let component: TicketPuzzleComponent;
  let fixture: ComponentFixture<TicketPuzzleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TicketPuzzleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
