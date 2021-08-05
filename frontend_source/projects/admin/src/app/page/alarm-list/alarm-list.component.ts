import {
  AutoUnsubscribe,
  ConditionalPipe,
} from 'projects/nvl-shared/src/public-api';
import { Component, OnInit, Input } from '@angular/core';
import { ActiveActionModel } from '../map-dashboard/active-action.model';
import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlarmListFilter } from './alarm-list.filter';
import { environment } from 'projects/admin/src/environments/environment';
import { Observable } from 'rxjs';
import { VehicleDetailsDailogComponent } from "../../component/vehicle-details-dailog/vehicle-details-dailog.component";
import { MatDialog } from "@angular/material/dialog";

const DROPDOWN_PATHS = environment.api.path.dropdown;


@AutoUnsubscribe()
@Component({
  selector: 'app-root',
  templateUrl: './alarm-list.component.html',
  styleUrls: ['./alarm-list.component.scss']
})

export class AlarmListComponent extends OverviewPageTemplate<any, AlarmListFilter>
  implements OnInit {
  conditionalPipe = new ConditionalPipe();

  loading = false;
  name$: Observable<any>;
  objects$: Observable<any>;

  userId: number;
  vehicelData: any;
  vehicleInterval: any;
  dialogRef: any;

  save(): void {
    this.loading = true;
  }

  @Input()
  alarmIcons = true;

  columns = [
    {
      name: 'Vehicles name',
      prop: 'name',
      nonResponsive: true,
      headerClass: "w-100 max-100",
      maxWidth: 200,
      cellClass: 'w-100'
    },
    {
      name: 'Vehicles Type',
      prop: 'traceable_object_type_name',
      // prop: 'name',
      maxWidth: 200,
    },
    {
      name: 'user-fullname',
      prop: 'user_fullname',
      maxWidth: 200,
      // textAling:'right'
    }

    //   {
    //     name: 'alarm',
    //     prop: 'alarm_list_icons'
    //   }
    //   {
    //     name: 'show-on-map',
    //     prop: 'show_on_map',
    //     pipe: this.conditionalPipe,
    //     cellClass: 'text-center',
    //     headerClass: 'text-center'
    //   },
    //   {
    //     name: 'collision-avoidance-system',
    //     prop: 'collision_avoidance_system',
    //     pipe: this.conditionalPipe,
    //     cellClass: 'text-center',
    //     headerClass: 'text-center'
    //   },
    //   {
    //     name: 'action',
    //     prop: 'action',
    //     pipe: this.conditionalPipe,
    //     cellClass: 'text-center',
    //     headerClass: 'text-center'
    //   },
    //   {
    //     name: 'active',
    //     prop: 'action',
    //     pipe: this.conditionalPipe,
    //     maxWidth: 200,
    //     cellClass: 'text-center',
    //     headerClass: 'text-center'
    //   },
    //   {
    //     name: 'action-list',
    //     prop: 'action_list',
    //     renderType: 'action_list',
    //     maxWidth: 100
    //   },
  ];

  constructor(
    protected restClientService: RestClientService,
    protected router: Router,
    protected notifyService: NotifyService,
    protected dialogService: DialogService,
    protected translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public dialog: MatDialog
    ) {
    super(
      environment.api.path.vehicles,
      environment.scopes.vehicles,
      restClientService,
      AlarmListFilter,
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

  ngOnInit() {
    this.subscribeToFilterChange();

    // if (!this.authenticationService.checkPermission('report', 'filter_users')) {
    //   this.name$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object);
    // }
    if (!this.authenticationService.checkPermission('report', 'filter_users')) {
      this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.vehicleType);
    }

  }

  onVehicleNameChange($event) {
    this.serviceFilter.name = $event;
    this.fetch();
  }

  onVehicleChange($event) {
    this.serviceFilter.vehicleType = $event;
    this.fetch();
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

  actionDialog(id) {
    this.dialogStatus(id);
  }
  vehicleService(id) {
    this.restClientService
      .get(
        environment.api.path.hw_module_user_position + "/point?vehicles=" + id
      )
      .subscribe((response) => {
        if (response.success) {
          this.vehicelData = JSON.stringify(response.data);
          // console.log(this.vehicelData, this.dialogRef)
        }
      });
  }

  dialogStatus(id){
      this.dialogRef = this.dialog.open(VehicleDetailsDailogComponent, {
        width: "1000px",
        data: id,
      });
  }
}
