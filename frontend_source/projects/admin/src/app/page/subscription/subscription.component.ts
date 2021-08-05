import { AutoUnsubscribe, ConditionalPipe, SimpleTimestampPipe, TimestampPipe } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { SimpleIso8601Pipe } from 'projects/nvl-shared/src/lib/pipe/simple-iso-8601.pipe';
import { SubscriptionFilter } from './subscription.filter';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html'
})
export class SubscriptionComponent extends OverviewPageTemplate<any, SubscriptionFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();
  simpleIso8601Pipe = new SimpleIso8601Pipe();

  columns = [
    // { name: 'subscription-uuid', prop: 'subscription_uuid', nonResponsive: true, minWidth: 200, isUuid: true },
    { name: 'Module name', prop: 'hw_mname', nonResponsive : true,minWidth: 200}, 
    { name: 'Vehicles', prop: 'vehicles' },
    { name: 'subscription-model-description', prop: 'subscription_model_description' },
    { name: 'Price', prop: 'unit_count' },
    // { name: 'rebate-value', prop: 'rebate_value' },
    { name: 'date-from', prop: 'date_from_format', pipe: this.simpleIso8601Pipe },
    { name: 'date-to', prop: 'date_to_format', pipe: this.simpleIso8601Pipe },
    { name: 'active', prop: 'active', pipe: this.conditionalPipe, maxWidth: 200, cellClass: 'text-center', headerClass: 'text-center' },
  ];

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService,
  ) {
    super(
      environment.api.path.subscription,
      environment.scopes.subscription,
      restClientService,
      SubscriptionFilter,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService
    );
  }

  ngOnInit() {
    this.subscribeToFilterChange();

    setTimeout(() => {
      if(!this.deletePermission){
        let $element = document.querySelector('.ml-2.float-right');
        $element.remove();
      }
    }, 1);
  }


  // fetch() {
  //   this.loader = true;
  //   this.restClientService.get(environment.api.path.subscription, `?page=${this.pageRequest.page}&size=${this.pageRequest.size}&${this.serviceFilter.toHttpParams().toString()}`).subscribe(
  //     response => {
  //       this.page = response.data;
  //       this.rows = response.data.content;

  //       this.rows.forEach(row => {
  //         if (!row.rebate_is_fixed) {
  //           row.rebate_value = `${row.rebate_value}%`;
  //         }
  //       });

  //       if (this.rows === undefined) { this.rows = []; }
  //       this.loader = false;
  //     }
  //   );
  // }
}
