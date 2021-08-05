import 'leaflet/dist/images/marker-shadow.png';

import { AutoUnsubscribe, ConditionalPipe } from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { LocationsFilter } from './locations.filter';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';

@AutoUnsubscribe()
@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html'
})
export class LocationsComponent extends OverviewPageTemplate<any, LocationsFilter> implements OnInit {
  conditionalPipe = new ConditionalPipe();

  columns = [
    { name: 'name', prop: 'name', nonResponsive: true, minWidth: 200 },
    { name: 'location-type', prop: 'location_type' },
    { name: 'show-on-map', prop: 'show_on_map', pipe: this.conditionalPipe, cellClass: 'text-center', headerClass: 'text-center' },
    { name: 'active', prop: 'active', pipe: this.conditionalPipe, maxWidth: 200, cellClass: 'text-center', headerClass: 'text-center' }
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
      environment.api.path.locations,
      environment.scopes.locations,
      restClientService,
      LocationsFilter,
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
