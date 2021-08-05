import {
  AutoUnsubscribe,
  ConditionalPipe,
} from 'projects/nvl-shared/src/public-api';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ActiveActionModel } from '../../map-dashboard/active-action.model';
import { AuthenticationService } from '../../../security/service/authentication/authentication.service';
import { DialogService } from 'dialog-service';
import { NotifyService } from '../../../service/notify/notify.service';
import { OverviewPageTemplate } from '../../overview-page.template';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MileageFilter } from './mileage-filter';
import { Rent } from './../../rents/rents.modals';
import { environment } from 'projects/admin/src/environments/environment';
import { DatePipe } from '@angular/common';

declare let L;

const DROPDOWN_PATHS = environment.api.path.dropdown;

@AutoUnsubscribe()

@Component({
  selector: 'app-mileage-details',
  templateUrl: './mileage-details.component.html',
  styleUrls: ['./mileage-details.component.scss']
})
export class MileageDetailsComponent extends OverviewPageTemplate<any, MileageFilter>
  implements OnInit {
  conditionalPipe = new ConditionalPipe();
  filter: MileageFilter;
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
      name: 'Status',
      prop: 'show_on_map',
      pipe: this.conditionalPipe,
      cellClass: 'text-center',
      headerClass: 'text-center'
    },

    {
      name: 'vehicles',
      prop: 'name',
      nonResponsive: true,
      minWidth: 200
    },
    // {
    //   name: 'Time Slot(MM)',
    //   prop: 'rentminits'
    // },
    {
      name: 'Start Time',
      prop: 'rent_datetime'
    },
    // {
    //   name: 'End Time',
    //   prop: 'end_time'
    // },
    // {
    //   name: 'Total Duration',
    //   prop: 'total_duration'
    // },
    // {
    //   name: 'Active Duration',
    //   prop: 'active_duration'
    // },
    // {
    //   name: 'Pause Duration',
    //   prop: 'alarm_pause_duration'
    // },
    // {
    //   name: 'Extended Time(MM)',
    //   prop: 'extended_time'
    // },
    // {
    //   name: 'user-fullname',
    //   prop: 'user_fullname'
    // },
    {
      name: 'Milege',
      prop: 'mileage'
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
      MileageFilter,
      router,
      notifyService,
      dialogService,
      translateService,
      authenticationService
    );
    this.filter = new MileageFilter();
  }

 // graph //
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [], label: 'Gari'},
    // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Yamaha'}
  ];


  actionListAction(event) {
    this.clickAction(event.row, event.action);
  }

  ngOnInit() {
    // this.subscribeToFilterChange();
    // this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);

    // if (!this.authenticationService.checkPermission('report', 'filter_users')) {
    //   this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object);
    // }
    // this.slot$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.slot)

    this.updateMileage();
  }

  updateMileage(){
    setTimeout(()=>{
      //  this.rows.map((ele, i) => ele['mileage'] = `7690${i} mile`)
      this.rows =[
        {
            "id": 1699,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:56:38",
            "active_duration": "0:56:38",
            "end_time": "2021-02-12 11:13:00",
            "extended_time": "0:51:38",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-02-12 10:16:22",
            "rentminits": 5,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76900 mile"
        },
        {
            "id": 1698,
            "name": "GARI",
            "alarm_pause_duration": "0:00:06",
            "total_duration": "0:46:22",
            "active_duration": "0:46:16",
            "end_time": "2021-02-06 10:20:42",
            "extended_time": "0:41:16",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-02-05 09:34:20",
            "rentminits": 5,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76901 mile"
        },
        {
            "id": 1697,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "2:46:45",
            "active_duration": "2:46:45",
            "end_time": "2021-02-01 11:23:09",
            "extended_time": "2:41:45",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-02-01 08:36:25",
            "rentminits": 5,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76902 mile"
        },
        {
            "id": 1696,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:01:32",
            "active_duration": "0:01:32",
            "end_time": "2021-02-01 08:36:07",
            "extended_time": "-0:03:28",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-02-01 08:34:36",
            "rentminits": 5,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76903 mile"
        },
        {
            "id": 1695,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:00:10",
            "active_duration": "0:00:10",
            "end_time": "2021-01-30 21:09:55",
            "extended_time": "-0:04:50",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-01-30 21:09:45",
            "rentminits": 5,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76904 mile"
        },
        {
            "id": 1694,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:05:06",
            "active_duration": "0:05:06",
            "end_time": "2021-01-29 17:16:10",
            "extended_time": "0:00:06",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-01-29 17:11:05",
            "rentminits": 5,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76905 mile"
        },
        {
            "id": 1693,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:58:56",
            "active_duration": "0:58:56",
            "end_time": "2021-01-29 14:34:52",
            "extended_time": "0:48:56",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-01-29 13:35:57",
            "rentminits": 10,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76906 mile"
        },
        {
            "id": 1692,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:04:31",
            "active_duration": "0:04:31",
            "end_time": "2021-01-29 09:46:40",
            "extended_time": "-0:00:29",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-01-29 09:42:10",
            "rentminits": 5,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76907 mile"
        },
        {
            "id": 1691,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:17:58",
            "active_duration": "0:17:58",
            "end_time": "2021-01-28 19:25:31",
            "extended_time": "0:07:58",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-01-28 19:07:33",
            "rentminits": 10,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76908 mile"
        },
        {
            "id": 1690,
            "name": "GARI",
            "alarm_pause_duration": "0:00:00",
            "total_duration": "0:10:32",
            "active_duration": "0:10:32",
            "end_time": "2021-01-28 16:59:12",
            "extended_time": "0:00:32",
            "slots": {
                "3_0": 5,
                "5_0": 10,
                "15_0": 20,
                "22_0": 40,
                "35_0": 80
            },
            "buzzer_on": false,
            "alarm_pause_status": false,
            "rent_datetime": "2021-01-28 16:48:41",
            "rentminits": 10,
            "traceable_object_type_id": 2,
            "user_id": 1,
            "user_fullname": "TestAdminUser",
            "note": "",
            "show_on_map": true,
            "action": true,
            "collision_avoidance_system": true,
            "consumption": "15",
            "registration_number": "0",
            "vin_number": "0",
            "vehicle_brand_id": 2,
            "vehicle_model": "",
            "vehicle_model_id": 7,
            "vehicle_year": "2020",
            "vehicle_default_throttle": "30",
            "active": true,
            "deleted": false,
            "remainTime": "",
            "mileage": "76909 mile"
        }
      ]

      let obj = { label:'Gari' ,data: []}, 
         label=[];

      this.rows.map(item => {
        obj['data'].push(Number(item['mileage'].split(' ')[0])),
        // this.barChartLabels.push(Number(item['rent_datetime'].split('-')[0]))
        this.barChartLabels.push(item['rent_datetime'].split(' ')[0])
      });
      // console.log(obj, label)
      this.barChartLabels = label;
      this.barChartData = [obj];

      // console.log(this.rows, 'rows')
    }, 1000)
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
    this.updateMileage();
  }


  resetFilters() {
    this.filter = new MileageFilter();
    this.rent = null;
    this.featureGroupPoint.clearLayers();
    this.updateMileage();
  }

  onUserSelectChange($event) {
    this.filter.name = null;

    let options;

    if ($event !== null && $event !== undefined) {
      options = `?user_id=${$event}`;
    }

    this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object, options);

    this.serviceFilter.user_id= $event;
    // this.fetch();
    this.updateMileage();
  }

  onTraceableObjectSelectChange($event) {

    this.serviceFilter.name = $event;
    // this.fetch();
    this.updateMileage();
  }
  // onSlotChange($event) {

  //   this.serviceFilter.name = $event;
  //   this.fetch();
  // }


  // onDateFromChange($event) {

  //   this.serviceFilter.dateFrom = $event;
  //   this.fetch();
  // }

  // onDateToChange($event) {

  //   this.serviceFilter.dateTo = $event;
  //   this.fetch();

  // }
}
