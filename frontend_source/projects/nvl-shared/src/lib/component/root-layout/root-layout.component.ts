import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { MenuItem } from '../../model/config/menu/menu-item.config';
import { RootLayoutConfig } from '../../model/config/root-layout.config';
import { Router } from '@angular/router';
import { StorageService } from '../../service/storage/storage.service';
import { TranslateService } from '@ngx-translate/core';

const MENU_MODE_SIDE = 'side';
const MENU_MODE_OVER = 'over';

@Component({
  selector: 'nvl-root-layout',
  templateUrl: './root-layout.component.html',
  styleUrls: ['./root-layout.component.scss']
})
export class RootLayoutComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private router: Router,
    public storageService: StorageService
  ) { }

  @Input()
  config: RootLayoutConfig;

  @Input()
  user: string;

  @Input()
  profileRoute: string;

  @Output()
  logout = new EventEmitter<any>();

  state = {
    innerWidth: window.innerWidth,
    sideMenuOpened: true,
    sideMenuMode: MENU_MODE_SIDE
  };

  menuItem: MenuItem;

  translate = (tag: string) => this.translateService.instant(tag);

  ngOnInit() {
    this.menuItem = this.storageService.getMeneItem();

    this.config.menu.groups.forEach(
      group => {
        if (group.header !== null && group.header !== undefined) {
          group.header = this.translate(group.header);
        }

        group.items.forEach(
          item => {
            item.label = this.translate(item.label);
          }
        );
      }
    );
  }

  /**
   * * Toggle side menu off/on.
   */
  toggleMenu() {
    this.state.sideMenuOpened = !this.state.sideMenuOpened;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.state.innerWidth = window.innerWidth;
  }

  /**
   * * Sidebar mode.
   */
  getMode() {
    if (this.state.innerWidth > 1000) {
      this.state.sideMenuMode = MENU_MODE_SIDE;
    } else if (this.state.sideMenuMode === MENU_MODE_SIDE) {
      this.state.sideMenuMode = MENU_MODE_OVER;
      this.state.sideMenuOpened = false;
    }

    return this.state.sideMenuMode;
  }

  /**
   * On click action.
   * @param item Clicked item
   */
  onClick(item: MenuItem) {
    this.storageService.saveMenuItem(item);
    this.menuItem = item;
    this.router.navigate([item.route]);
  }

  doLogout() {
    this.logout.emit();
  }

  getClass(element: string) {
    switch (element) {
      case 'avatar':
        return this.config.avatar && this.config.avatar.class ? this.config.avatar.class : 'avatar';
    }
  }

  getStyle(element: string) {
    switch (element) {
      case 'avatar:background-color':
        return this.config.avatar && this.config.avatar.background ? this.config.avatar.background : '';
    }
  }

  openUserProfile() {
    let userProfileMenuItem = new MenuItem();
    userProfileMenuItem.id = 0;
    this.storageService.saveMenuItem(userProfileMenuItem);
    this.menuItem = userProfileMenuItem;
    this.router.navigate([this.profileRoute]);
  }
}
