import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'nvl-clear-add',
  templateUrl: './clear-add.component.html'
})
export class ClearAddComponent implements OnInit {

  @Input()
  addEnabled = true;

  @Input()
  defaultViewEnabled = false;

  @Output()
  addNew = new EventEmitter();

  @Output()
  resetFilters = new EventEmitter();

  @Output()
  defaultViewAction = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  doResetFilter() {
    this.resetFilters.emit();
  }

  doAddNew() {
    this.addNew.emit();
  }

  doDefaultViewAction() {
    this.defaultViewAction.emit();
  }

}
