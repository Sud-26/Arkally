import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'nvl-cancel-save',
  templateUrl: './cancel-save.component.html',
  styleUrls: ['./cancel-save.component.scss']
})
export class CancelSaveComponent implements OnInit {

  @Output()
  cancel = new EventEmitter();

  @Output()
  save = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  doCancel($event) {    
    $event.preventDefault();
    this.cancel.emit();
  }

  doSave() {
    this.save.emit();
  }

}
