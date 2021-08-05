import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivFieldComponent } from './div-field.component';

describe('DivFieldComponent', () => {
  let component: DivFieldComponent;
  let fixture: ComponentFixture<DivFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
