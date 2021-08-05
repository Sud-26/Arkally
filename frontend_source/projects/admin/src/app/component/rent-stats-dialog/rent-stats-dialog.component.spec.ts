import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentStatsDialogComponent } from './rent-stats-dialog.component';

describe('RentStatsDialogComponent', () => {
  let component: RentStatsDialogComponent;
  let fixture: ComponentFixture<RentStatsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentStatsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentStatsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
