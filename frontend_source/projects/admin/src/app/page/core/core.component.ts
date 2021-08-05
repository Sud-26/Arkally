import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { BigScreenService } from 'angular-bigscreen';
import { MenuItem } from 'projects/nvl-shared/src/public-api';
import { SidemenuService } from '../../service/sidemenu/sidemenu.service';
import { rootConfig } from 'projects/admin/src/configs/root';
import { RootLayoutComponent } from 'projects/nvl-shared/src/lib/component/root-layout/root-layout.component';


@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  @ViewChild('root', { static: null })
  elementRef: RootLayoutComponent;

  user;
  config = rootConfig;

  constructor(
    public authenticationService: AuthenticationService,
    private sidemenuService: SidemenuService,
    private bigscreenService: BigScreenService
  ) { }

  ngOnInit() {
    this.user = this.authenticationService.getUserFullName();

    this.config.menu.groups.forEach(
      group => {
        group.items.forEach((item: MenuItem) => {
          item.hidden = !this.authenticationService.checkAcl(item.scope);
        });
      }
    );

    this.sidemenuService.setRootLayoutComponent(this.elementRef);

    this.bigscreenService.onChange(
      () => {
        setTimeout(() => this.sidemenuService.toggle(), 500)
      }
    );
  }

  logout() {
    this.authenticationService.logout();
    location.reload(true);
  }

  toggle() {
    this.elementRef.toggleMenu();
  }

}
