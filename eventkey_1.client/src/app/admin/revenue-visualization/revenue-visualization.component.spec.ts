import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueVisualizationComponent } from './revenue-visualization.component';

describe('RevenueVisualizationComponent', () => {
  let component: RevenueVisualizationComponent;
  let fixture: ComponentFixture<RevenueVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevenueVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
