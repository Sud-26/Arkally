import { AutoUnsubscribe, ConditionalPipe } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { SupportFilter } from './support.filter';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html'
})
export class SupportComponent extends OverviewPageTemplate<any, SupportFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();

  columns = [
    { name: 'email', prop: 'email', nonResponsive: true, minWidth: 200 },
    { name: 'subject', prop: 'subject' },
    { name: 'file-name', prop: 'file_name' },
    { name: 'message', prop: 'message', minWidth: 500 },
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
      environment.api.path.support,
      environment.scopes.support,
      restClientService,
      SupportFilter,
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
