import { AutoUnsubscribe, ConditionalPipe } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementFilter } from './user-management.filter';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent extends OverviewPageTemplate<any, UserManagementFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();

  columns = [
    { name: 'email', prop: 'email', nonResponsive: true, minWidth: 200 },
    { name: 'fullname', prop: 'fullname' },
    { name: 'Country', prop: 'country' },
    { name: 'Company Name', prop: 'companyname' },
    { name: 'account_type', prop: 'account_type_name' },
    { name: 'active', prop: 'active', pipe: this.conditionalPipe, maxWidth: 200, cellClass: 'text-center', headerClass: 'text-center' },
  ];

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService
  ) {
    super(
      environment.api.path.user_management,
      environment.scopes.user_management,
      restClientService,
      UserManagementFilter,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService
    );
  }

  ngOnInit() {
    this.subscribeToFilterChange();
  }
}
