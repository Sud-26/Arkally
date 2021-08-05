import { AutoUnsubscribe, ConditionalPipe } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RebateFilter } from './rebate.filter';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html'
})
export class RebateComponent extends OverviewPageTemplate<any, RebateFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();

  columns = [
    { name: 'value', prop: 'value', nonResponsive: true, minWidth: 200 },
    { name: 'description', prop: 'meta_information.description' },
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
      environment.api.path.rebate,
      environment.scopes.rebate,
      restClientService,
      RebateFilter,
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
