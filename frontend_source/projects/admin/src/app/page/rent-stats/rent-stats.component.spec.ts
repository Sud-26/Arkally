import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentStatsComponent } from './rent-stats.component';

describe('RentStatsComponent', () => {
  let component: RentStatsComponent;
  let fixture: ComponentFixture<RentStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
