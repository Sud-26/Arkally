import {
  AutoUnsubscribe,
  ConditionalPipe,
} from 'projects/nvl-shared/src/public-api';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ActiveActionModel } from '../map-dashboard/active-action.model';
import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RentFilter } from './rent.filter';
import { Rent } from './rents.modals';
import { environment } from 'projects/admin/src/environments/environment';
import { DatePipe } from '@angular/common';

declare let L;

const DROPDOWN_PATHS = environment.api.path.dropdown;

@AutoUnsubscribe()
@Component({
  selector: 'app-root',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.scss']
})
export class RentComponent extends OverviewPageTemplate<any, RentFilter>
  implements OnInit {
  conditionalPipe = new ConditionalPipe();
  filter: RentFilter;
  rent: Rent;
  featureGroupPoint;
  featureGroupLine;
  users$: Observable<any>;
  objects$: Observable<any>;
  slot$: Observable<any>;
  dateFrom: Observable<any>;
  dateTo: Observable<any>;


  @Input()
  alarmIcons = true;

  columns = [
    {
      name: 'vehicles',
      prop: 'name',
      nonResponsive: true,
      headerClass: "w-100 max-100",
      maxWidth: 150,
      // cellClass:"w-100"
      // minWidth: 200
    },
    {
      name: 'Time Slot(MM)',
      prop: 'rentminits'
    },
    {
      name: 'Start Time',
      prop: 'rent_datetime'
    },
    {
      name: 'End Time',
      prop: 'end_time'
    },
    {
      name: 'Total Duration',
      prop: 'total_duration'
    },
    {
      name: 'Active Duration',
      prop: 'active_duration'
    },
    {
      name: 'Pause Duration',
      prop: 'alarm_pause_duration'
    },
    {
      name: 'Extended Time(MM)',
      prop: 'extended_time'
    },
    {
      name: 'user-fullname',
      prop: 'user_fullname'
    },

  ];
  
  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    // private filterType: new (datePipe: DatePipe) => RentFilter,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public datePipe: DatePipe,
    // private rentFilter: RentFilter,
  ) {
    super(
      environment.api.path.vehicle_wise_rent_statics,
      environment.scopes.vehicles,
      restClientService,
      RentFilter,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService
    );
    this.filter = new RentFilter();
  }

  actionListAction(event) {
    this.clickAction(event.row, event.action);
  }

  ngOnInit() {
    this.subscribeToFilterChange();
    this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);

    if (!this.authenticationService.checkPermission('report', 'filter_users')) {
      this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object);
    }
    this.slot$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.slot)
  }



  clickAction(row, action) {
    const model = new ActiveActionModel();

    model.hw_action_id = action.hw_action_id;
    model.name = action.name;
    model.hw_module_id = row.id;

    action.disabled = true;

    this.restClientService
      .post(environment.api.path.command, model)
      .subscribe((response) => {
        if (response.success) {
          this.notifyService.successExecute();
        } else {
          this.notifyService.error(response.message);
        }
      });
  }


  resetFilters() {
    this.filter = new RentFilter();
    this.rent = null;
    this.featureGroupPoint.clearLayers();
  }

  onUserSelectChange($event) {
    this.filter.traceableObjectId = null;

    let options;

    if ($event !== null && $event !== undefined) {
      options = `?user_id=${$event}`;
    }

    this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object, options);

    this.serviceFilter.userId = $event;
    this.fetch();
  }

  onTraceableObjectSelectChange($event) {

    this.serviceFilter.traceableObjectId = $event;
    this.fetch();
  }
  onSlotChange($event) {

    this.serviceFilter.slot = $event;
    this.fetch();
  }


  onDateFromChange($event) {

    this.serviceFilter.dateFrom = $event;
    this.fetch();
  }

  onDateToChange($event) {

    this.serviceFilter.dateTo = $event;
    this.fetch();
 
  }

  // private getTripInfo() {
  //   if (this.featureGroupLine !== undefined) {
  //     this.featureGroupLine.clearLayers();
  //   }

  //   this.restClientService.get(environment.api.path.trip_info, `?${this.filter.toHttpParams().toString()}`).subscribe(
  //     response => {
  //       if (response.success) {
  //         this.rent = response.data;
  //       }
  //     }
  //   );
  // }
}

