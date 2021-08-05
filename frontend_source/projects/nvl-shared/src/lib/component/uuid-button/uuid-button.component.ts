import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'nvl-uuid-button',
  templateUrl: './uuid-button.component.html',
})
export class UuidButtonComponent implements OnInit {
  @Input() entity: any;

  @Output() uuidClick = new EventEmitter<any>(true);

  constructor() {
  }

  ngOnInit() {
  }

  getLabel() {
    return this.entity !== undefined && this.entity ? this.entity.substring(0, 8) : '';
  }

  copy() {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.entity));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  buttonUuidClick() {
    this.uuidClick.emit(this.entity);
  }

}
