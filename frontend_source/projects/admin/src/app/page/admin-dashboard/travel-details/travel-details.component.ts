import { Component, OnInit } from '@angular/core';

import { Observable, from } from 'rxjs';
import { Page, PageRequest } from 'projects/nvl-shared/src/public-api';
import { AuthenticationService } from '../../../security/service/authentication/authentication.service';
import { BigScreenService } from 'angular-bigscreen';
import { DatePipe } from '@angular/common';
// import { MapComponent } from 'projects/nvl-shared/src/lib/component/map/map.component';
import { MapService } from 'projects/nvl-shared/src/lib/service/map/map.service';
import { Report } from './../../report/report.model';
import { ReportFilter } from './../../report/report.filter';
import { RestClientService } from '../../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
// import { SelectionType } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';
// import { Options } from '@angular-slider/ngx-slider';
import { NotifyService } from '../../../service/notify/notify.service';
// import { noUndefined } from '@angular/compiler/src/util';
import * as moment from 'moment';
const DROPDOWN_PATHS = environment.api.path.dropdown;
@Component({
  selector: 'app-travel-details',
  templateUrl: './travel-details.component.html',
  styleUrls: ['./travel-details.component.scss']
})
export class TravelDetailsComponent implements OnInit {

  users$: Observable<any>;
	objects$: Observable<any>;
  vehicleTemp: any;
  vehicleName: any;
	filter: ReportFilter;
	report: Report;
  label: any;
  graphStatus: boolean = false;
  pageRequest: PageRequest = new PageRequest(1, 10);
	page: Page<Report>;
	loader = false;

  constructor(
    private restClientService: RestClientService,
		private translateService: TranslateService,
		public authenticationService: AuthenticationService,
		protected mapService: MapService,
		protected bigScreenService: BigScreenService,
		protected router: Router,
		private datePipe: DatePipe,
		private notifyService: NotifyService
  ) { 
    this.filter = new ReportFilter(this.datePipe);

  }

  //pi //
  public pieChartLabels = [];
  public pieChartData = [];
  public pieChartType:string = 'pie';
  
  // // events
  // public chartClicked(e:any):void {
  //   // console.log(e);
  // }
  
  // public chartHovered(e:any):void {
  //   // console.log(e);
  // }

  //Speed//
  public speedBarChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public speedBarChartLabels = [];
  public speedBarChartType = "bar";
  public speedBarChartLegend = true;
  // public speedBarChartData = [];
  public speedBarChartData = [
    { data: [], label: "" }
  ];

  //bar chart //
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = [];
  public barChartType = 'radar';
  public barChartLegend = true;
  public barChartData = [
    {data: [], label: ''},
  ];

  // new bar chart
  public newBarChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	  };
	  public newBarChartLabels = [];
	  public newBarChartType = 'line';
	  public newBarChartLegend = true;
	  public newBarChartData = [
		// {data: [65, 59, 80, 81, 56, 55, 40], label: 'Novi'},
		{ data: [], label: ''},
		// {data: [10, 48, 40, 19, 86, 27, 90], label: 'Yamaha2'}
	  ];

  ngOnInit() {
    this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);

		if (!this.authenticationService.checkPermission('report', 'filter_users')) {
  			this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object);
    }
    // this.loadGraph();
  }

  onUserSelectChange($event) {
		// debugger
		this.filter.dateTo = null;
		this.filter.dateFrom = null;
		this.report = null;
		this.filter.traceableObjectId = null;

		let options;

		if ($event !== null && $event !== undefined) {
			options = `?user_id=${$event}`;
		}

		this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object, options);
    this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object, options).subscribe((res)=> this.vehicleTemp = res);
	}

  onTraceableObjectSelectChange($event) {
		this.filter.dateTo = null;
		this.filter.dateFrom = null;
		this.report = null;

    this.vehicleName = this.vehicleTemp.filter((ele, i) => ele.id == $event)
    console.log(this.vehicleName, 'event')
	}

  onDateFromChange($event) {
		this.filter.dateTo = null;
		this.filter.dateFrom = $event;
	}


	onDateToChange($event) {
		this.filter.dateTo = $event;
		this.fetch();
	}

  resetFilters() {
		this.filter = new ReportFilter(this.datePipe);
		this.report = null;
	}
  private getTripInfo() {
		// if (this.featureGroupLine !== undefined) {
		// 	this.featureGroupLine.clearLayers();
		// }
		this.restClientService.get(environment.api.path.trip_info, `?${this.filter.toHttpParams().toString()}`).subscribe(
			response => {
				if (response.success) {
					this.report = response.data;
          this.label = this.report['name'];

				}
			}
		);
	}


  private fetch() {
		this.loader = true;
		this.getTripInfo();

    // http://arkally.com/api/nvl_report/graphData?page=1&size=10&traceable_object_id=36&user_id=1&date_from=2021-06-01T13:31:24.000+0530&date_to=2021-06-21T13:31:32.000+0530
		this.restClientService.get(environment.api.path.report, `/graphData?page=${this.pageRequest.page}&size=${this.pageRequest.size}&${this.filter.toHttpParams().toString()}`).subscribe(
			response => {
				this.page = response.data;

				if (response !== null && response !== undefined && response.data !== null && response.data !== undefined) {
          const arr = response.data;
          this.graphStatus = true
          this.loadGraph(arr)
				
        } else{
          this.graphStatus = false;
        }
				this.loader = false;
			}
		);
	}

  
  loadGraph(arr){
  // loadGraph(){
    // let parseData=  JSON.parse(localStorage.getItem('obj'))
    // let arr =  parseData.data
    const { speed, voltage } = arr.rightTop
    const bottomGraphs  = arr.bottomGraphs
    this.graphStatus = true;
    let speedArr = [], voltArr = [], newChart = [], pieArr=[],
        speedLabel = [], barChartLabel = [], newChartLabel =[],pieLabel=[];
    Object.keys(speed).forEach(function(key) {
      speedArr.push(speed[key])
      speedLabel.push(key);
      pieArr.push(parseInt(key))
      pieLabel.push(key);
    });
    // debugger
    this.speedBarChartData[0]['data'] = speedArr;
    this.speedBarChartLabels = speedLabel;
    this.pieChartData= pieArr;
    this.pieChartLabels = pieLabel;

    // console.log(this.pieChartData, this.pieChartLabels)
  
    Object.keys(voltage).forEach(function(key) {
      voltArr.push(voltage[key]);
      barChartLabel.push(key);
    });
    this.barChartData[0]['data'] = speedArr
    this.barChartLabels =  barChartLabel
  
    bottomGraphs.forEach((ele) => {
      newChart.push(ele.speed)
      newChartLabel.push(moment(ele['date_time']).format("DD-MM-YYYY"))
      // newChartLabel.push(ele['voltage_level']+'vol')
    });
    this.newBarChartData[0]['data']=  newChart
    this.newBarChartLabels = newChartLabel

    // this.pieChartLabels = [this.vehicleName[0].name]
    this.speedBarChartData[0]['label'] = this.vehicleName[0].name
    this.barChartData[0]['label'] = this.vehicleName[0].name
    this.newBarChartData[0]['label'] = this.vehicleName[0].name
          
  }

}
