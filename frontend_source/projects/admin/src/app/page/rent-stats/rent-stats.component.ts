import {
  AutoUnsubscribe,
  ConditionalPipe,
} from 'projects/nvl-shared/src/public-api';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, from,Unsubscribable } from 'rxjs';
import { ActiveActionModel } from '../map-dashboard/active-action.model';
import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RentStatsFilter } from './rent-stats.filter';
import { RentStats } from './rent-stats.modals';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';
import { DatePipe } from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { RentStatsDialogComponent } from '../../component/rent-stats-dialog/rent-stats-dialog.component';

declare let L;
const path = environment.api.path,
      DROPDOWN_PATHS = path.dropdown,
      statsReport = path.vehicle_wise_rent_statics_reports;

@Component({
  selector: 'app-rent-stats',
  templateUrl: './rent-stats.component.html',
  styleUrls: ['./rent-stats.component.scss']
})
export class RentStatsComponent extends OverviewPageTemplate<any, RentStatsFilter>
  implements OnInit {

  conditionalPipe = new ConditionalPipe();
  filter: RentStatsFilter;
  rent: RentStats;
  featureGroupPoint;
  featureGroupLine;
  users$: Observable<any>;
  objects$: Observable<any>;
  slot$: Observable<any>;
  dateFrom: Observable<any>;
  dateTo: Observable<any>;
  obj:any;
  quickTime$: any;

  columns = [
    {
      name: 'name',
      prop: 'name',
      nonResponsive: true,
      minWidth: 100,
      maxWidth: 200
    },
    {
      name: 'user Id',
      prop: 'trraceable_object_id',
      nonResponsive: true,
      minWidth: 100,
      maxWidth: 200
    }
  ];
  rentRows = [];

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    // private filterType: new (datePipe: DatePipe) => RentStatsFilter,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public datePipe: DatePipe,
    public dialog: MatDialog
    // private rentStatsFilter: RentStatsFilter,
  ) {
    
    super(
      statsReport,
      environment.scopes.vehicles,
      restClientService,
      RentStatsFilter,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService
    );
   
    
  }

  actionListAction(event) {
    this.clickAction(event.row, event.action);
  }

  openCountModal(data){

    let slot = Object.keys(data.row).find(key => data.row[key] ===  data.value);

    let arr = {
      userId: data.row.trraceable_object_id,
      slot: slot.split('_')[1],
      quickTime:  this.serviceFilter.quickTime 
    }

    this.dialog.open(RentStatsDialogComponent, {
      width: '1200px',
      data: arr
    });

  }
  ngOnInit() {
    this.subscribeToFilterChange();
    this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);

    if (!this.authenticationService.checkPermission('report', 'filter_users')) {
      this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object);
    }
    this.slot$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.slot);
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
    this.filter = new RentStatsFilter();
    this.serviceFilter = new RentStatsFilter();
    this.rent = null;
    // this.featureGroupPoint.clearLayers();
    this.fetch();
  }

  onUserSelectChange($event) {
    // this.filter.traceableObjectId = null;

    let options;

    if ($event !== null && $event !== undefined) {
      options = `?user_id=${$event}`;
    }

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
  onQuickTimeChange($event){
    this.serviceFilter.quickTime = $event;
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

}
