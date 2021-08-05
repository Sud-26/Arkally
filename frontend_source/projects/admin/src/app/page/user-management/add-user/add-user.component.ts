import { Component, OnInit } from '@angular/core';

import { AddPageTemplate } from '../../add-page.template';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/lib/decorator/autounsubscribe.decorator';
import { NotifierService } from 'angular-notifier';
import { NotifyService } from '../../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserManagement } from '../user-management.model';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})
export class AddUserComponent extends AddPageTemplate<UserManagement> implements OnInit {

  languages$: Observable<any>;
  accountTypes$: Observable<any>;
  timezones$: Observable<any>;

  secondPassword: string;


  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected translateService: TranslateService
  ) {
    super(
      environment.api.path.user_management,
      restClientService,
      router,
      notifyService,
      translateService
    );
    this.model = new UserManagement();
  }

  ngOnInit() {
    this.languages$ = this.restClientService.get(environment.api.path.dropdown.language);
    this.accountTypes$ = this.restClientService.get(environment.api.path.dropdown.account_type);
    this.timezones$ = this.restClientService.get(environment.api.path.dropdown.timezone);
  }

  save() {
    if (this.newForm.valid && this.model.password !== this.secondPassword) {
      this.notifyService.error('passwords-dont-match');
    } else if (this.newForm.valid && this.model.password === this.secondPassword) {
      this.restClientService.post(this.path, this.model).subscribe(
        response => {
          if (response.success) {
            this.router.navigate([this.returnPath]);
            this.notifyService.successSave();
          } else {
            this.notifyService.error(response.message);
          }

        }
      );
    }
  }
}
