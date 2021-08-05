import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { NotifierService } from 'angular-notifier';
import { NotifyService } from '../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';
import { UserManagement } from '../../page/user-management/user-management.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  passwordNew: string;
  passwordOld: string;

  userId: number;
  timezoneId: number;
  mapPoolTime: number;
  selectedLocale;
  model: any;

  env = environment;
  panelOpenState = false;

  timezones$: Observable<any>;

  

  translate = (tag: string) => this.translateService.instant(tag);

  constructor(
    private restClientService: RestClientService,
    public authenticationService: AuthenticationService,
    protected notifierService: NotifierService,
    protected translateService: TranslateService,
    private notifyService: NotifyService
  ) { 

    this.model = new UserManagement();
  }

  ngOnInit() {
    this.timezoneId = this.authenticationService.getUserAttribute('timezone_id') as number;
    this.mapPoolTime = this.authenticationService.getUserAttribute('map_pool_time') as number;
    this.userId = this.authenticationService.getUserId();

    this.timezones$ = this.restClientService.get(environment.api.path.dropdown.timezone);

    this.setDefaultLanguage();

    this.getUsersDetails();
  }

  changePassword() {
    const path = `${environment.api.path.update_password}/${this.userId}`;
    const params = { password: this.passwordNew, old_password: this.passwordOld };

    this.restClientService.put(path, params).subscribe(
      response => this.process(response)
    );
  }

  changeMapPoolTime() {
    const path = `${environment.api.path.update_map_pool_time}/${this.userId}`;
    const params = { map_pool_time: this.mapPoolTime };

    this.restClientService.put(path, params).subscribe(
      response => this.process(response)
    );
  }

  changeTimezone() {
    const path = `${environment.api.path.update_timezone}/${this.userId}`;
    const params = { timezone_id: this.timezoneId };

    this.restClientService.put(path, params).subscribe(
      response => this.process(response)
    );
  }

  private process(response: any) {
    if (response.success) {
      this.authenticationService.overwriteAccessToken(response.data);
      this.notifyService.successSave();
    } else {
      this.notifyService.error(response.message);
    }
  }

  languageChange($event) {
    localStorage.setItem('locale', this.selectedLocale);

    let langToSet = localStorage.getItem('locale');

    if (langToSet === undefined || langToSet === null) {
      langToSet = 'en';
    }

    this.translateService.use(langToSet).subscribe(
        () =>  window.location.reload(true)
    );
  }

  setDefaultLanguage() {
    const locale = localStorage.getItem('locale');

    if (locale === undefined || locale === null) {
      this.selectedLocale = 'en';
    } else {
      this.selectedLocale = locale;
    }
  }
  onSubmit(){
    // console.log(this.model,'')
    this.restClientService.post(environment.api.path.user_management+'/update_profile', this.model).subscribe(
      response => {
        if (response.success) {
          // console.log(response,'response')
          // this.router.navigate([this.returnPath]);
          this.notifyService.successSave();
        } else {
          this.notifyService.error(response.message);
        }
      })
  }

  getUsersDetails(){
    this.restClientService.get(environment.api.path.user_management+`/${this.userId}`).subscribe(
      response => {
        if (response.success) {
           this.model = response.data;
          // console.log(response,'response')
          // this.router.navigate([this.returnPath]);
          this.notifyService.successSave();
        } else {
          this.notifyService.error(response.message);
        }
      })
  }
}
