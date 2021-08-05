import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'nvl-drop-menu',
  templateUrl: './drop-menu.component.html',
  styleUrls: ['./drop-menu.component.scss']
})
export class DropMenuComponent {

  @Input() user;

  @Output()
  logout = new EventEmitter<any>();

  @Output()
  openUserProfile = new EventEmitter<any>();

  constructor() { }

  doLogout() {
    this.logout.emit();
  }

  doOpenUserProfile() {
    this.openUserProfile.emit();
  }
}
