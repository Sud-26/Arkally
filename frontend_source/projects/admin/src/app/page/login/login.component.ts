import {  MenuItem } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';

import { Router } from '@angular/router';
import { StorageService } from 'projects/nvl-shared/src/lib/service/storage/storage.service';
import { environment } from 'projects/admin/src/environments/environment';
import { first } from 'rxjs/operators';
import { loginConfig } from 'projects/admin/src/configs/login';
import { rootConfig } from 'projects/admin/src/configs/root';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';

@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  config = loginConfig;
  loginAttempt = 0;
  environment = environment;

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() { }

  login(event) {
    if (this.valid(event)) {
      this.authenticate(event.username, event.password);
    } else {
      this.loginAttempt++;
    }
  }

  private valid(event) {
    // TODO validate input
    return true;
  }

  private authenticate(username: string, password: string) {
    this.authenticationService
      .login(username, password)
      .pipe(first())
      .subscribe(data => {
        this.navigate();
      }, error => {
        this.loginAttempt++;
      });
  }

  private navigate() {
    const item: MenuItem = rootConfig.menu.groups[0].items[0];
    this.storageService.saveMenuItem(item);
    this.router.navigate([item.route]);
  }
}
