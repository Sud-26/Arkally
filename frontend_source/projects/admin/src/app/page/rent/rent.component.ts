import { AutoUnsubscribe, ConditionalPipe, SimpleTimestampPipe, TimestampPipe } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DatePipe } from '@angular/common';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { Observable } from 'rxjs';
import { OverviewPageTemplate } from '../overview-page.template';
import { RentFilter } from './rent.filter';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { SimpleIso8601Pipe } from 'projects/nvl-shared/src/lib/pipe/simple-iso-8601.pipe';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html'
})
export class RentComponent extends OverviewPageTemplate<any, RentFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();
  simpleIso8601Pipe = new SimpleIso8601Pipe();

  users$: Observable<any>;
  
  columns = [
    { name: 'action-name', prop: 'hw_action_name' },
    { name: 'user-fullname', prop: 'user_fullname' },
    { name: 'alaram-time', prop: 'alaram_time' },
    { name: 'date-from', prop: 'date_from', pipe: this.simpleIso8601Pipe },
    { name: 'date-to', prop: 'date_to', pipe: this.simpleIso8601Pipe },
    { name: 'Diff-timer', prop: 'diff_timer'},
    { name: 'state', prop: 'state' },
    { name: 'active', prop: 'active', pipe: this.conditionalPipe, maxWidth: 200, cellClass: 'text-center', headerClass: 'text-center' },
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
      environment.api.path.rent,
      environment.scopes.rent,
      restClientService,
      null,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService,
      false
    );

    this.serviceFilter = new RentFilter(this.datePipe);
    this.setFirstPage();
  }

  ngOnInit() {
    this.users$ = this.restClientService.get(environment.api.path.dropdown.user_management);
    this.subscribeToFilterChange();
  }

  isAuthinticated() {
    return this.authenticationService.checkPermission('rent', 'filter_user');
  }
}
