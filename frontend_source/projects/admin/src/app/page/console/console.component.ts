import {
  AutoUnsubscribe,
  ConditionalPipe,
  TimestampPipe
} from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { ConsoleFilter } from './console.filter';
import { DatePipe } from '@angular/common';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-console',
  templateUrl: './console.component.html'
})
export class ConsoleComponent extends OverviewPageTemplate<any, ConsoleFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();
  timestampPipe = new TimestampPipe();

  columns = [
    { name: 'timestamp', prop: 'timestamp', nonResponsive: true, pipe: this.timestampPipe },
    { name: 'user-fullname', prop: 'user_fullname' },
    { name: 'message', prop: 'message', minWidth: 500 },
    { name: 'active', prop: 'active', pipe: this.conditionalPipe, maxWidth: 200, cellClass: 'text-center', headerClass: 'text-center' }
  ];

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService,
    private datePipe: DatePipe
  ) {
    super(
      environment.api.path.console,
      environment.scopes.console,
      restClientService,
      null,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService,
      false
    );
    this.serviceFilter = new ConsoleFilter(this.datePipe);

    this.setDefaultDates();
    this.setFirstPage();
  }

  ngOnInit() {
    this.subscribeToFilterChange();
  }

  private setDefaultDates() {
    this.serviceFilter.dateTo = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    this.serviceFilter.dateFrom = oneWeekAgo;
  }

}
