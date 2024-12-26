import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryMatchingComponent } from './memory-matching.component';

describe('MemoryMatchingComponent', () => {
  let component: MemoryMatchingComponent;
  let fixture: ComponentFixture<MemoryMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemoryMatchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoryMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
