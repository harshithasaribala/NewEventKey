import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmprofileComponent } from './emprofile.component';

describe('EmprofileComponent', () => {
  let component: EmprofileComponent;
  let fixture: ComponentFixture<EmprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
