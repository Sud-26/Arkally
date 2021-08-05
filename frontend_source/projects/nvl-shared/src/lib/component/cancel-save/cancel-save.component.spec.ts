import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSaveComponent } from './cancel-save.component';

describe('CancelSaveComponent', () => {
  let component: CancelSaveComponent;
  let fixture: ComponentFixture<CancelSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
