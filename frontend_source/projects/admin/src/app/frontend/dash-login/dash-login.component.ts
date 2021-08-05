import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'projects/nvl-shared/src/public-api';
import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { Router } from '@angular/router';
import { StorageService } from 'projects/nvl-shared/src/lib/service/storage/storage.service';
import { environment } from 'projects/admin/src/environments/environment';
import { first } from 'rxjs/operators';
import { loginConfig } from 'projects/admin/src/configs/login';
import { rootConfig } from 'projects/admin/src/configs/root';
import { LoginForm } from '../login.model';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { NotifyService } from '../../service/notify/notify.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-dash-login',
  templateUrl: './dash-login.component.html',
  styleUrls: ['./../dashboard/dashboard.component.scss']
})
export class DashLoginComponent implements OnInit {
  config = loginConfig;
  loginAttempt = 0;
  environment = environment;
  loginForm: LoginForm;

  @Output()
  forgetPass = new EventEmitter();

  constructor(
    public authenticationService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private storageService: StorageService,
    protected restClientService: RestClientService,
    protected notifyService: NotifyService,
  ) { }

  ngOnInit() {
  }

  openForgotPass($event) {
    this.forgetPass.emit($event)
  }

  onLogin(form, event: Event) {
    event.preventDefault();

    if (form.email != "" && form.password != "") {
      if (this.valid(form)) {
        this.authenticate(form.email, form.password);
      } else {
        this.notifyService.error('Authentication failed, Please enter valid details');
        this.loginAttempt++;
      }
    } else {
      this.notifyService.error('Please fill the required fields')
    }
  }

  private valid(form) {
    // TODO validate input
    return true;
  }

  private authenticate(email: string, password: string) {
    this.authenticationService
      .login(email, password)
      // .pipe(first())
      .subscribe(data => {
        this.navigate();
        this.dialog.closeAll();

      }, error => {
        console.log(error)
        this.notifyService.error(error.message);
        this.loginAttempt++;
      });
  }
  private navigate() {
    const item: MenuItem = rootConfig.menu.groups[0].items[0];
    // console.log(item)
    this.storageService.saveMenuItem(item);
    this.router.navigate([item.route]);
  }


}
