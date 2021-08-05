import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestClientService } from "../../service/rest-client/rest-client.service";
// import { Router } from "@angular/router";
// import { TranslateService } from "@ngx-translate/core";
import { environment } from "projects/admin/src/environments/environment";
@Component({
  selector: "app-vehicle-details-dailog",
  templateUrl: "./vehicle-details-dailog.component.html",
  styleUrls: ["./vehicle-details-dailog.component.scss"],
})
export class VehicleDetailsDailogComponent implements OnInit {
  vehicleData: any;
	actions: any[];
	name: string;
	hw_module_id: any;
  vehicelData: any;

	pollSubscription;

	timer: string;
	alarm_on_tme: any;
	minutes: any;
	seconds: any;
	interval: any;
	getApiData: any;
	timerData:any;
	pausePlayStatus:boolean;
	parentList: any;
	nMinutes:any;
	nSeconds:any;
	timeSlots: any;
	pauseTime: any;
	features: any;
	alarmState: boolean;
	buzzerOn: boolean;
	stopEngine: boolean;
	disableEngine: boolean;
  vehicleInterval: any;
  isDataNull: boolean= true;

  constructor(
    public dialogRef: MatDialogRef<VehicleDetailsDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    protected restClientService: RestClientService,
  ) {
    // console.log(dialogRef, this.data, "modal data");
    // const item = {
    //     hw_module_id: 44,
    //     gprs_active: false,
    //     data: {
    //       date: "05/23/21",
    //       time: "05/23/21 13:43:20",
    //       speed: "6.8",
    //       fuel_level: 25,
    //       gps_active: false,
    //       message_id: "10",
    //       track_angle: 97.3000030518,
    //       magnetic_var: "nan",
    //       voltage_level: 13.6976613998,
    //       vehicle_running: false,
    //       time_microseconds: "0",
    //     },
    //     alarm_on_tme: null,
    //     alarm_pause_time: null,
    //     device_id: 36,
    //     alarm_start: 40,
    //     alarm_pause_status: false,
    //     alarm_pause_duration: 0,
    //     disable_engine_start: false,
    //     stop_engine: false,
    //     buzzer_on: false,
    //     alarm_state: false,
    //     slots: '{"3_0": 5, "5_0": 10, "15_0": 20, "22_0": 40, "35_0": 80}',
    //     vehicle_name: "GARI",
    //     vehicle_data: {
    //       vin_number: "0",
    //       action_list: [
    //         {
    //           icon: "hearing",
    //           name: "SOUND BUZZER",
    //           type: "button",
    //           state: false,
    //           disabled: false,
    //           data_type: "bool",
    //           max_value: 1,
    //           min_value: 0,
    //           action_type: "user",
    //           hw_action_id: 6,
    //         },
    //         {
    //           icon: "power_settings_new",
    //           name: "STOP ENGINE",
    //           type: "button",
    //           state: false,
    //           disabled: false,
    //           data_type: "bool",
    //           max_value: 1,
    //           min_value: 0,
    //           action_type: "user",
    //           hw_action_id: 4,
    //         },
    //         {
    //           icon: "highlight_off",
    //           name: "DISABLE ENGINE START",
    //           type: "toggle",
    //           state: false,
    //           disabled: false,
    //           data_type: "bool",
    //           max_value: 1,
    //           min_value: 0,
    //           action_type: "user",
    //           hw_action_id: 5,
    //         },
    //       ],
    //       consumption: "15",
    //       vehicle_year: "2020",
    //       vehicle_brand: "",
    //       vehicle_model: "",
    //       vehicle_brand_id: 2,
    //       vehicle_model_id: 7,
    //       registration_number: "0",
    //       vehicle_default_throttle: "30",
    //     },
      
    // };
    
    this.vehicleService(data);
    this.vehicleInterval = setInterval(()=> {
        this.vehicleService(data);
    }, 5000)

    this.dialogRef.afterClosed().subscribe((result) => clearInterval(this.vehicleInterval));
  }
  initData(parentData: any){
    // console.log(parentData)
    
    
      this.data = parentData.properties.data;
      this.vehicleData = parentData.properties.vehicle_data;
      this.actions = parentData.properties.vehicle_data.action_list.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));
      this.name = parentData.properties.vehicle_name;
      this.hw_module_id = parentData.properties.hw_module_id;
      this.parentList = parentData.properties;
  
      this.timeSlots = JSON.parse(parentData.properties.slots);
      this.alarmState = parentData.properties.alarm_state;
      this.buzzerOn = parentData.properties.buzzer_on;
      this.stopEngine = parentData.properties.stop_engine;
      this.disableEngine = parentData.properties.disable_engine_start;
      // this.onLoadEvent(this.parentList);
  
      // this.featureInterval();
  
    // } else{
    //    this.isDataNull = true;
    // }
  }

  vehicleService(id) {
    console.log(id, 'id')
    this.restClientService
      .get(
        environment.api.path.hw_module_user_position + "/point?vehicles=" + id
      )
      .subscribe((response) => {
        if (response.success) {
          // this.vehicelData = JSON.stringify(response.data);
          if(response.data.features.length){
            this.isDataNull = false;
            this.initData(response.data.features[0]);
          } else{
            this.isDataNull = true;
          }
          // this.initData([{'stop_engine': true}]);
          console.log(response.data.features, 'response data')
          // let responseData = response.data;
        }
      });
  }

  ngOnInit() {}
}
