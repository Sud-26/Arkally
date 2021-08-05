import {
  AutoUnsubscribe,
  ConditionalPipe,
} from 'projects/nvl-shared/src/public-api';
import { Component, OnInit } from '@angular/core';

import { ActiveActionModel } from '../map-dashboard/active-action.model';
import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../service/notify/notify.service';
import { OverviewPageTemplate } from '../overview-page.template';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VehiclesFilter } from './vehicles.filter';
import { environment } from 'projects/admin/src/environments/environment';
import {MatDialog} from '@angular/material/dialog';
import { VehicleSlotDialog } from '../../component/vehicle-slot-dialog/vehicle-slot-dialog.component';


@AutoUnsubscribe()

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
})
export class VehiclesComponent extends OverviewPageTemplate<any, VehiclesFilter>
  implements OnInit {
  conditionalPipe = new ConditionalPipe();
  rowId:any;
  timeSlotObj:any = {};
  slots:any;

  columns = [
    {
      name: 'Vechiles Name',
      prop: 'name',
      nonResponsive: true,
      minWidth: 200
    },
    {
      name: 'Vehicles Type',
      prop: 'traceable_object_type_name'
    },
    {
      name: 'user-fullname',
      prop: 'user_fullname'
    },
    {
      name: 'show-on-map',
      prop: 'show_on_map',
      pipe: this.conditionalPipe,
      cellClass: 'text-center',
      headerClass: 'text-center'
    },
    {
      name: 'collision-avoidance-system',
      prop: 'collision_avoidance_system',
      pipe: this.conditionalPipe,
      cellClass: 'text-center',
      headerClass: 'text-center'
    },
    {
      name: 'action',
      prop: 'action',
      pipe: this.conditionalPipe,
      cellClass: 'text-center',
      headerClass: 'text-center'
    },
    {
      name: 'active',
      prop: 'active',
      pipe: this.conditionalPipe,
      maxWidth: 200,
      cellClass: 'text-center',
      headerClass: 'text-center'
    }
    // ,
    // {
    //   name: 'action-list',
    //   prop: 'action_list',
    //   renderType: 'action_list',
    //   maxWidth: 100
    // }
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
      VehiclesFilter,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService
    );
  }

  openDialog(row): void {
    // console.log(row)
      this.rowId= row.id;
      const dialogRef = this.dialog.open(VehicleSlotDialog, {
        width: '1000px',
        // data: row.slots != null ? row.slots :  {slotStartTime: '12', slotDuration: 20 } 
        data: row.slots != null && Object.keys(row.slots).length ? row.slots : {'12_2': 5, '13_4': 10, '14_6': 15}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
          let obj={};
          result.forEach(element => {
            obj[`${element.key}_${element.duration == undefined ? 0 : element.duration}`]  = Number(element.value); 
          });
          this.timeSlotObj =  obj;
  
          const model = new TimeSlotModel();
          model.time_slots = this.timeSlotObj;
  
          this.restClientService
            .put(environment.api.path.vehileTimeSlot+ '/'+ row.id, model)
            .subscribe((response) => {
              if (response.success) {
                // let responseData = response.data;
                this.fetch();
                // responseData.slots;
                // console.log(responseData)
              } 
          }); 

         
  
        }
    
      });
  }

  actionListAction(event) {
    this.clickAction(event.row, event.action);
  }

  ngOnInit() {
    this.subscribeToFilterChange();
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

  
}

export class TimeSlotModel {
  time_slots: any
}
