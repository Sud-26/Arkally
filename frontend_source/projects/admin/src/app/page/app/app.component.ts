import { AutoUnsubscribe, SvgIconService } from 'projects/nvl-shared/src/public-api';
import { NavigationStart, Router } from '@angular/router';

import { Component } from '@angular/core';
import { StorageService } from 'projects/nvl-shared/src/lib/service/storage/storage.service';
import { Subscription } from 'rxjs';
import { rootConfig } from 'projects/admin/src/configs/root';

@AutoUnsubscribe()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  subscription: Subscription;

  constructor(private svgIconService: SvgIconService, private router: Router, private storageService: StorageService) {
    svgIconService.add('assets', 'avatar', './assets/img/ap_login.svg');
    svgIconService.add('assets', 'navbar-icon', '/assets/img/ap_logo_navbar.svg');
    svgIconService.add('assets', 'logo', './assets/img/logo2.svg');

    this.subscription =
      router.events.subscribe((event) => {
        this.findMenuItemFromRoute(event, router);
      });
  }

  private findMenuItemFromRoute(event, router: Router) {
    if (event instanceof NavigationStart) {
      if (!router.navigated) {
        const itemId = window.location.pathname.split('/')[1];
        rootConfig.menu.groups.forEach(
          group => {
            group.items.forEach(item => {
              if (item.route === `/${itemId}`) { this.storageService.saveMenuItem(item); }
            });
          });
      }
    }
  }
}
