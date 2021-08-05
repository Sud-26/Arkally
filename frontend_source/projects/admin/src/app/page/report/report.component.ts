import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe, ConditionalPipe, DateTimestamp, Page, PageRequest, TimestampPipe } from 'projects/nvl-shared/src/public-api';
import { Observable, from } from 'rxjs';

import { AuthenticationService } from '../../security/service/authentication/authentication.service';
import { BigScreenService } from 'angular-bigscreen';
import { DatePipe } from '@angular/common';
import { MapComponent } from 'projects/nvl-shared/src/lib/component/map/map.component';
import { MapService } from 'projects/nvl-shared/src/lib/service/map/map.service';
import { Report } from './report.model';
import { ReportFilter } from './report.filter';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Options } from '@angular-slider/ngx-slider';
import { NotifyService } from '../../service/notify/notify.service';
// import { noUndefined } from '@angular/compiler/src/util';

declare let L;
const GEOGRAPHY_COLOR = '#FF8000';
const DROPDOWN_PATHS = environment.api.path.dropdown;

let myMovingMarker;


@AutoUnsubscribe()
@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss'],

})
export class ReportComponent extends MapComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('reportMap', { static: null })
	elementRef: ElementRef;
	
	@ViewChild('actionBar', { static: true }) actionBar: ElementRef;
	@ViewChild('actionSlider', { static: true }) actionSlider: ElementRef;

	SelectionType = SelectionType
	conditionalPipe = new ConditionalPipe();
	dateTimestampPipe = new DateTimestamp();

	users$: Observable<any>;
	objects$: Observable<any>;

	filter: ReportFilter;
	report: Report;

	pageRequest: PageRequest = new PageRequest(1, 10);
	page: Page<Report>;
	loader = false;

	featureGroupPoint;
	featureGroupLine;

	rows = [];
	route = [
		[51.452339, -0.26291], [51.452011, -0.26479], [51.451839, -0.26624], [51.45187, -0.26706], [51.451881, -0.26733], [51.452049, -0.26734], [51.453098, -0.26734], [51.453838, -0.26717], [51.454849, -0.267], [51.45575, -0.26704], [51.45631, -0.26723], [51.456402, -0.26729], [51.456669, -0.26745], [51.45689, -0.26755], [51.457001, -0.26758], [51.45797, -0.26776], [51.458359, -0.26786], [51.459019, -0.26783], [51.459629, -0.26785], [51.459888, -0.26809], [51.460178, -0.26845], [51.46077, -0.26841], [51.461102, -0.26838], [51.461479, -0.2685], [51.46159, -0.26848], [51.462479, -0.26776], [51.462921, -0.26766], [51.463291, -0.26754], [51.463558, -0.26736], [51.46373, -0.26728], [51.464291, -0.26676], [51.464432, -0.26675], [51.464722, -0.26671], [51.464821, -0.2657], [51.46484, -0.2655], [51.464851, -0.26504], [51.46489, -0.26456]
	]
    restart: boolean = false;
    pause: boolean = false;
    play: boolean = true;
	speed;
	gaugeChart:boolean = true;
	gpsValue:any = "-";
	latLng:any = "-";
	cordArray = [];
	speedArray = [];
	actionBarStatus:boolean = false;
	disabledPrev:boolean = true;
	disabledNext:boolean = true;

	// SpeedoMeter

	public canvasWidth = 180;
	public needleValue = 0;
	public centralLabel = '';
	public name = 'Speed(mpl)';
	public bottomLabel = '0';
	public options = {
		hasNeedle: true,
	    needleColor: 'black',
		arcColors: [],
		arcDelimiters: [10, 60, 90],
		arcPadding: 6,
		arcPaddingColor: 'white',
		arcLabels: ['35', '60', '100'],
		arcLabelFontSize: false,
		//arcOverEffect: false,
		// label options
		rangeLabel: ['0', '100'],
		centralLabel: '175',
		rangeLabelFontSize: false,
		labelsFont: 'Consolas',
	}

	// mapData = [
	// 	{
	// 		"type": "Feature",
	// 		"geom": {
	// 			"type": "LineString",
	// 			"coordinates": [
	// 				// [
	// 				//     [
	// 				//       48.8567, 2.3508
	// 				//     ],
	// 				//     [
	// 				//       50.45, 30.523333
	// 				//     ]
	// 				// ]
	// 				[
	// 					//  [51.45187, -0.26706], [51.451839, -0.26624], [51.452011, -0.26479],  [51.452339, -0.26291]
	// 					[51.507222, -0.1275], [48.8567, 2.3508],
	// 					[41.9, 12.5], [52.516667, 13.383333], [44.4166, 26.1]
	// 				]
	// 				// [[42.6437644958,18.1673374176],[42.6437644958,18.1673374176],[42.6437568665,18.167339325],[42.6437530518,18.1673374176],[42.6437568665,18.1673679352]]

	// 			]
	// 		},
	// 		"meta_information":{
	// 			"date": "01/30/21",
	// 			"time": "01/30/21 11:55:06",
	// 			"speed": "0.9",
	// 			"fuel_level": 40,
	// 			"gps_active": true,
	// 			"message_id": "10",
	// 			"track_angle": 358.2300109863,
	// 			"magnetic_var": "nan",
	// 			"voltage_level": 12.0652246475,
	// 			"vehicle_running": true,
	// 			"time_microseconds": "0"
	// 		},
	// 		"properties": {
	// 			"label": "Tester1",
	// 			"color": "#860606",
	// 			"id": 158,
	// 			"name": "Tester1",
	// 			"icon": "location_on"
	// 		}
	// 	}
	// ]

	// mapData= [
	// 	{
	// 		"id": 932350,
	// 		"user_id": 1,
	// 		"traceable_object_id": 36,
	// 		"hw_module_id": 44,
	// 		"geom": {
	// 			"type": "Point",
	// 			"coordinates": [
	// 				51.507222, -0.1275
	// 			]
	// 		},
	// 		"show_on_map": true,
	// 		"active": true,
	// 		"meta_information": {
	// 			"date": "01/30/21",
	// 			"time": "01/30/21 11:55:06",
	// 			"speed": "0.0",
	// 			"fuel_level": 40,
	// 			"gps_active": true,
	// 			"message_id": "10",
	// 			"track_angle": 358.2300109863,
	// 			"magnetic_var": "nan",
	// 			"voltage_level": 12.0652246475,
	// 			"vehicle_running": true,
	// 			"time_microseconds": "0"
	// 		},
	// 		"record_time": 1612011313,
	// 		"in_geofence": true,
	// 		"event_time": "2000-01-01T21:01:30.210Z"
	// 	},
	// 	{
	// 		"id": 932348,
	// 		"user_id": 1,
	// 		"traceable_object_id": 36,
	// 		"hw_module_id": 44,
	// 		"geom": {
	// 			"type": "Point",
	// 			"coordinates": [
	// 				48.8567, 2.3508
	// 			]
	// 		},
	// 		"show_on_map": true,
	// 		"active": true,
	// 		"meta_information": {
	// 			"date": "01/30/21",
	// 			"time": "01/30/21 11:55:05",
	// 			"speed": "0.0",
	// 			"fuel_level": 40,
	// 			"gps_active": true,
	// 			"message_id": "10",
	// 			"track_angle": 358.2300109863,
	// 			"magnetic_var": "nan",
	// 			"voltage_level": 12.0652246475,
	// 			"vehicle_running": true,
	// 			"time_microseconds": "0"
	// 		},
	// 		"record_time": 1612011308,
	// 		"in_geofence": true,
	// 		"event_time": "2000-01-01T21:01:30.210Z"
	// 	},
	// 	{
	// 		"id": 932346,
	// 		"user_id": 1,
	// 		"traceable_object_id": 36,
	// 		"hw_module_id": 44,
	// 		"geom": {
	// 			"type": "Point",
	// 			"coordinates": [
	// 				41.9, 12.5
	// 			]
	// 		},
	// 		"show_on_map": true,
	// 		"active": true,
	// 		"meta_information": {
	// 			"date": "01/30/21",
	// 			"time": "01/30/21 11:55:00",
	// 			"speed": "0.8",
	// 			"fuel_level": 40,
	// 			"gps_active": true,
	// 			"message_id": "10",
	// 			"track_angle": 101.2699966431,
	// 			"magnetic_var": "nan",
	// 			"voltage_level": 12.0652246475,
	// 			"vehicle_running": true,
	// 			"time_microseconds": "0"
	// 		},
	// 		"record_time": 1612011302,
	// 		"in_geofence": true,
	// 		"event_time": "2000-01-01T21:01:30.210Z"
	// 	},
	// 	{
	// 		"id": 932344,
	// 		"user_id": 1,
	// 		"traceable_object_id": 36,
	// 		"hw_module_id": 44,
	// 		"geom": {
	// 			"type": "Point",
	// 			"coordinates": [
	// 				52.516667, 13.383333
	// 			]
	// 		},
	// 		"show_on_map": true,
	// 		"active": true,
	// 		"meta_information": {
	// 			"date": "01/30/21",
	// 			"time": "01/30/21 11:54:55",
	// 			"speed": "0.9",
	// 			"fuel_level": 40,
	// 			"gps_active": true,
	// 			"message_id": "10",
	// 			"track_angle": 100.9400024414,
	// 			"magnetic_var": "nan",
	// 			"voltage_level": 12.0652246475,
	// 			"vehicle_running": true,
	// 			"time_microseconds": "0"
	// 		},
	// 		"record_time": 1612011298,
	// 		"in_geofence": true,
	// 		"event_time": "2000-01-01T21:01:30.210Z"
	// 	},
	// 	{
	// 		"id": 932342,
	// 		"user_id": 1,
	// 		"traceable_object_id": 36,
	// 		"hw_module_id": 44,
	// 		"geom": {
	// 			"type": "Point",
	// 			"coordinates": [
	// 				44.4166, 26.1
	// 			]
	// 		},
	// 		"show_on_map": true,
	// 		"active": true,
	// 		"meta_information": {
	// 			"date": "01/30/21",
	// 			"time": "01/30/21 11:54:45",
	// 			"speed": "0.0",
	// 			"fuel_level": 40,
	// 			"gps_active": true,
	// 			"message_id": "10",
	// 			"track_angle": 175.25,
	// 			"magnetic_var": "nan",
	// 			"voltage_level": 12.0652246475,
	// 			"vehicle_running": true,
	// 			"time_microseconds": "0"
	// 		},
	// 		"record_time": 1612011292,
	// 		"in_geofence": true,
	// 		"event_time": "2000-01-01T21:01:30.210Z"
	// 	}
	// ]

	value: number = 0;
	// sliders: any;
	sliders: Options = {
		floor: 0,
		ceil: localStorage.getItem('cordinateLength') != undefined ? Number(localStorage.getItem('cordinateLength')) : this.pageRequest.size-1,
		step: 1,
		showTicks: true,
		showTicksValues: false
	};
	columns = [
		{ name: 'coordinates', prop: 'geom.coordinates' },
		{ name: 'speed', prop: 'meta_information.speed' },
		{ name: 'event-time', prop: 'event_time', pipe: this.dateTimestampPipe },
		{ name: 'in-geofence', prop: 'in_geofence', pipe: this.conditionalPipe, cellClass: 'text-center', headerClass: 'text-center' },
	];

	translate = (tag: string) => this.translateService.instant(tag);

	constructor(
		private restClientService: RestClientService,
		private translateService: TranslateService,
		public authenticationService: AuthenticationService,
		protected mapService: MapService,
		protected bigScreenService: BigScreenService,
		protected router: Router,
		private datePipe: DatePipe,
		private  notifyService: NotifyService
	) {
		super(bigScreenService, mapService);
		this.filter = new ReportFilter(this.datePipe);
	}

	public barChartOptions = {
		scaleShowVerticalLines: false,
		responsive: true
	  };
	  public barChartLabels = ['10-30 kmh', '30-60 kmh', '60-90 kmh', '90-120 kmh'];
	  public barChartType = 'line';
	  public barChartLegend = true;
	  public barChartData = [
		// {data: [65, 59, 80, 81, 56, 55, 40], label: 'Novi'},
		{data: [20, 38, 30, 9, 76, 17, 80], label: 'Yamaha'},
		// {data: [10, 48, 40, 19, 86, 27, 90], label: 'Yamaha2'}
	  ];

	ngOnInit() {
		this.users$ = this.restClientService.get(DROPDOWN_PATHS.user_management);

		if (!this.authenticationService.checkPermission('report', 'filter_users')) {
			this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object);
		}
		this.actionBar.nativeElement.style.display = "none"

	}
	//GaugeChart Hide Show //
	onSlideToggle(event){
		this.gaugeChart = !event.checked;
	}
	//
	// gaugeChange(event) {
	// 	this.needleValue = Number(event.target.value);
	// 	this.bottomLabel = event.target.value;
	// }

   

	addMovingMarker(){
		const icon = L.divIcon({
			className: 'custom-div-icon',
			html: `<div class='marker-pin'></div><svg version="1.1" style="transform: rotate(42deg);"  width="40" height="40"   x="0px" y="0px"
				viewBox="0 0 427.912 427.912" style="enable-background:new 0 0 427.912 427.912;" xml:space="preserve">
			 <path fill="rgb(31, 120, 180)" d="M417.935,221.673c-30.554-29.857-81.027-73.723-121.169-87.859c-5.103-1.797-9.785-2.418-14.08-2.137
				 c-28.853-13.104-52.267-18.5-54.162-18.925c-0.832-0.186-1.683-0.28-2.535-0.28h-18.839c-6.403,0-11.595,5.191-11.595,11.595
				 s5.191,11.595,11.595,11.595h17.473c3.815,0.943,16.579,4.303,33.151,10.767c-12.381,15.737-17.014,38.362-17.014,38.362h-82.503
				 c-20.007,0-36.229,16.222-36.235,36.23H7.096c0,0-3.947,7.377-6.023,15.634c20.615,3.892,80.787,14.296,153.143,18.141
				 C231.373,258.894,337.618,256.114,417.935,221.673z M344.441,177.299c0,0,52.143,31.04,24.639,31.04
				 C337.712,208.339,344.441,177.299,344.441,177.299z"/>
			 <path fill="rgb(31, 120, 180)" d="M426.151,230.724c-35.082,15.613-77.675,26.44-126.895,32.193c-28.21,3.297-58.636,4.95-90.909,4.95
				 c-17.77,0-36.096-0.501-54.925-1.505C81.77,262.543,21.918,252.349,0,248.247c0.325,2.512,1.145,4.791,2.676,6.601
				 c15.551,18.367,48.87,32.039,90.214,40.947c4.308-0.892,8.466-2.232,12.247-3.993c4.086-1.904,7.353-4.605,10.813-7.465
				 c0.769-0.636,1.539-1.272,2.314-1.898c1.336-1.077,2.965-1.625,4.603-1.625c1.343,0,2.69,0.369,3.885,1.115
				 c0.976,0.611,1.945,1.23,2.916,1.852c5.136,3.285,9.987,6.388,16.054,8.169c5.399,1.586,11.496,2.46,17.168,2.46
				 c3.15,0,6.101-0.267,8.77-0.793c0.028-0.005,0.057-0.011,0.086-0.016c5.652-1.043,9.644-2.213,12.943-3.794
				 c4.191-2.008,7.518-4.354,9.887-6.974l9.393-10.389c1.379-1.524,3.334-2.399,5.39-2.412c0.015,0,0.029,0,0.044,0
				 c2.039,0,3.986,0.85,5.373,2.347l1.586,1.714l0.819,0.885c0.946,1.022,1.868,2.065,2.761,3.074c3.353,3.79,6.519,7.37,10.828,9.84
				 c0.02,0.011,0.038,0.022,0.057,0.033c6.582,3.853,15.805,6.245,24.066,6.245c0.179,0,0.357-0.001,0.545-0.003
				 c8.732-0.098,16.424-1.564,22.857-4.358c3.827-1.661,7.217-3.957,10.807-6.388c1.1-0.745,2.237-1.515,3.389-2.266
				 c1.221-0.797,2.613-1.19,4.001-1.19c1.638,0,3.271,0.548,4.606,1.63c0.898,0.726,1.783,1.463,2.67,2.201
				 c2.088,1.742,4.063,3.388,6.182,4.852c4.678,2.961,9.35,4.957,14.691,6.276c0.533,0.132,1.083,0.25,1.635,0.367
				 C391.887,279.087,437.607,250.991,426.151,230.724z"/>
		 
		 </svg>`,
			iconAnchor: [16, 30] // 24 44
		});
		myMovingMarker = L.Marker.movingMarker(
			this.cordArray,
			this.speedArray,
			{ autostart: true, icon }
		).addTo(this.map);
		L.polyline(this.cordArray, { color: 'rgb(51, 160, 44)' }).addTo(this.map);
		this.map.fitBounds(this.cordArray);
		myMovingMarker.start();		
		this.updateSpeedMeter();
	}
	// Interval to Update data
	updateSpeedMeter(){	
		this.speed = setInterval(() => {
			let needle =  Number(myMovingMarker._currentDuration) / 1000,
				label =   Number(myMovingMarker._currentDuration) / 1000;
			
		  	// this.options.needleUpdateSpeed = 200;
			this.needleValue =  Number(needle.toFixed(1));
			this.bottomLabel = String(label.toFixed(1));
			this.value = myMovingMarker._currentIndex+1;
			this.latLng = myMovingMarker._latlng;

			// console.log(JSON.parse(localStorage.getItem('map')), myMovingMarker._currentDuration)
			this.gpsValue = this.rows[myMovingMarker._currentIndex]['meta_information'].time;

			// console.log(myMovingMarker._currentIndex, myMovingMarker)

			if (!myMovingMarker.isRunning()) {
				this.value = myMovingMarker._currentIndex+1;
				clearInterval(this.speed);
				myMovingMarker.bindPopup(`<b>TestAdminUser !</b><br /> avg speed:${Number((needle).toFixed(1))}mpl </a>`, { closeOnClick: false })
					.openPopup();
				this.pause = false;
				this.play = false
				this.restart = true;			 
			}
		}, 1000)
	}

	// Restart JetSki marker
	reStartSpeedoMeter(time){
		myMovingMarker.bindPopup().closePopup();
		this.pause = true;
		this.restart = false;
		this.value = 0;
		myMovingMarker.start();
		this.updateSpeedMeter();
		this.disabledNext = true;
		this.disabledPrev = true;
	}

	 // Play JetSki Marker
	 playSpeedoMeter(time) {
		this.play = false;
		this.pause = true;
		// debugger
		if (myMovingMarker != undefined) {
			  
			myMovingMarker.resume();
			this.updateSpeedMeter();

			this.disabledNext = true;
			this.disabledPrev = true;
		}
		if (myMovingMarker === undefined) {
			 this.addMovingMarker();
			//  this.disabledPrev = false;
			//  this.disabledNext = false;
			// this.updateStatusBar();		
		}
	}
    // Pause JetSki marker
	pauseSpeedoMeter(time) {	
		myMovingMarker.pause();
		clearInterval(this.speed);
		this.play = true;
		this.pause = false;	
		this.disabledNext = false;
		this.disabledPrev = false;
	}

	// Next Cordinate JetSki marker
	nextSpeedoMeter(time) {
		this.play = true;
		this.pause = false;
		if(myMovingMarker != undefined){
			myMovingMarker.pause();

			// this.value+1;
			
			// if(this.cordArray.length-1 > this.value){
			// 	this.sliderEvent({value: 1})
			// }

			let index  = this.value === 0 ? 1 : this.value,
			    count =  this.value === 0 ? 1 : this.value,
			    cOrdinate = this.cordArray;
				if(this.value != 0 && cOrdinate.length-1 > index){
					count =  count+1;
					this.sliderEvent({value: count})
				} else{
					this.disabledNext = true;
				}

				if(this.value === 0)	{
				
					this.sliderEvent({value: 1})
				}	
		}
		// if (myMovingMarker === undefined) {
		// 	this.addMovingMarker();
		// 	myMovingMarker.pause();
		// 	// this.updateStatusBar();		
		// }
	}

    // Previous Cordinate JetSki marker
	prevSpeedoMeter(time) {
		this.play = true;
		this.pause = false;
		if(myMovingMarker != undefined){
			myMovingMarker.pause();
			
			// if(this.value > 0 && this.cordArray.length > this.value){
			// 	this.value-1;
			// 	this.sliderEvent({value: 1})
			// }
			// if(this.value === 0){
			// 	this.sliderEvent({value: 0})
			// }
			let index  = this.value === 0 ? 1 : this.value,
			    count =  this.value === 0 ? 1 : this.value,
			    cOrdinate = this.cordArray;;
				if(this.value === 0){
					this.disabledPrev = true;
					this.sliderEvent({value: 0})
				}
			
				if(this.value != 0 && cOrdinate.length > index){
					count =  count-1;
					this.sliderEvent({value: count})
				}
		}
	}

	// RangeSlide On Change //
	sliderEvent(event){
		// clearInterval(this.speed);
		if(myMovingMarker != undefined &&  event.value != undefined){
			// myMovingMarker._updatePosition(myMovingMarker._latlngs[event.value])
			myMovingMarker.setLatLng(myMovingMarker._latlngs[event.value]);	
			this.value = event.value;


			let needle =  Number(myMovingMarker._currentDuration) / 1000,
				label =   Number(myMovingMarker._currentDuration) / 1000;
			
		  	// this.options.needleUpdateSpeed = 200;
			this.needleValue =  Number((needle).toFixed(1));
			this.bottomLabel = String((label).toFixed(1));
			// this.value = myMovingMarker._currentIndex+1;
			this.latLng = myMovingMarker._latlng;
			this.gpsValue = this.rows[myMovingMarker._currentIndex]['meta_information'].time;
			
		}
	}
	// SetInitial Views on map //
	setMapRoute(){
		if(this.rows.length){
			// this.rows = this.mapData;
			this.rows.map((element, i) => {
				this.cordArray.push(element.geom.coordinates);
				this.speedArray.push(Number(element['meta_information']['speed'] < 0.1  ? 1 : element['meta_information']['speed'])*1000);
			});
			
			
			// let opts: Options = {
				// 	floor: 0,
				// 	ceil: this.cordArray.length-1,
				// 	step: 1,
				// 	showTicks: false,
				// 	showTicksValues: false
				// };
				// this.sliders = opts;
				
			let coOrd = this.cordArray;
			localStorage.setItem('cordinateLength', String(coOrd.length-1))
			// this.map.setView(coOrd[0], 5);
			this.map.fitBounds(coOrd);
	
			const icon = L.divIcon({
				className: 'custom-div-icon',
				html: `<div class='marker-pin'><svg width="15" height="15" version="1.1" x="0px" y="0px"
								viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
							<path fill="rgb(31, 120, 180)" d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z"/>
						</svg>`,
				iconAnchor: [9, 9] // 24 44
			});
			
			L.marker(coOrd[0], { icon }).addTo(this.map);
			L.marker(coOrd[coOrd.length-1], { icon }).addTo(this.map);
	
			// this.mapData.map(element => getCord.push(element.geometry.coordinates));
			//  console.log(getCord)
			L.polyline(this.cordArray).addTo(this.map);
			let actionEle =  L.control({position: 'bottomleft'})
	
			actionEle.onAdd=(map)=> this.actionBar.nativeElement;
			actionEle.addTo(this.map)
				// actionEle.onAdd=(map)=> {
				// 	let div = L.DomUtil.create('div', 'bottom-bar');
				// 		div = this.actionBar.nativeElement;
				// 		// div = this.actionSlider.nativeElement;
				// 		return div;
				// }
				
			// this.mapService.addLocations(this.mapData, this.featureGroupLine, GEOGRAPHY_COLOR);

		}
	
	}


	ngAfterViewInit() {
		this.init();
	
	}

	ngOnDestroy() {
	}

	resetFilters() {
		this.filter = new ReportFilter(this.datePipe);
		this.report = null;
		this.featureGroupPoint.clearLayers();
	}

	onUserSelectChange($event) {
		// debugger
		this.filter.dateTo = null;
		this.filter.dateFrom = null;
		this.report = null;
		this.page = null;
		this.filter.traceableObjectId = null;

		let options;

		if ($event !== null && $event !== undefined) {
			options = `?user_id=${$event}`;
		}

		this.objects$ = this.restClientService.getForDropdown(DROPDOWN_PATHS.traceable_object, options);
	}

	onTraceableObjectSelectChange($event) {
		this.filter.dateTo = null;
		this.filter.dateFrom = null;
		this.report = null;
		this.page = null;
		this.getTripInfo();
	}

	onDateFromChange($event) {
		this.filter.dateTo = null;
		this.filter.dateFrom = $event;
		this.page = null;
	}

	onDateToChange($event) {
		this.filter.dateTo = $event;
		this.setFirstPage();	
	}

	setPage(pageNumber: number) {
		this.pageRequest.page = pageNumber;
		this.fetch();
		this.setMapRoute();
	}

	changePageSize(size) {
		this.pageRequest = new PageRequest(1, size);
		this.setFirstPage();
	}

	setFirstPage() {
		this.setPage(1);
	}

	selectedRow($event) {
		const coordinates = $event.selected[0]
			.geom
			.coordinates;

		this.featureGroupPoint.clearLayers();

		const marker = L.marker(coordinates).addTo(this.featureGroupPoint);



		this.map.setView(this.featureGroupPoint.getBounds().getCenter(), environment.zoomLevel.reportMarker);
	}
	

	private init() {
		this.createMap();
		this.addLayers(
			[
				'open-street-maps',
				'open-sea-maps',
				'graticule',
				'scalebar'
			]
		);
		// this.addScalebarButton();
		this.addExpandButton();

		this.featureGroupPoint = L.featureGroup().addTo(this.map);
		this.featureGroupLine = L.featureGroup().addTo(this.map);

		this.map._onResize();

		
	}


	private getTripInfo() {
		if (this.featureGroupLine !== undefined) {
			this.featureGroupLine.clearLayers();
		}
		this.restClientService.get(environment.api.path.trip_info, `?${this.filter.toHttpParams().toString()}`).subscribe(
			response => {
				if (response.success) {
					this.report = response.data;

				}
			}
		);
	}

	private fetch() {
		this.loader = true;
		this.getTripInfo();

		this.restClientService.get(environment.api.path.report, `?page=${this.pageRequest.page}&size=${this.pageRequest.size}&${this.filter.toHttpParams().toString()}`).subscribe(
			response => {
				this.page = response.data;

				// console.log(response.data.content, 'pages', this.sliders)

				if (response !== null && response !== undefined && response.data !== null && response.data !== undefined) {
					this.rows = response.data.content;
					// this.actionBarStatus = true;
					this.actionBar.nativeElement.style.display = "flex";
					if(this.rows != undefined && this.rows.length){
						this.setMapRoute();
					}

				}

				if (this.rows === undefined) { this.rows = []; this.notifyService.error('No record found');}
				
				this.loader = false;
			}
		);

		this.restClientService.get(`${environment.api.path.module_position.line}`, `?${this.filter.toLineHttpParams().toString()}`).subscribe(
			response => {

				if (response.data.features !== undefined && Array.isArray(response.data.features)) {
					this.mapService.addPolyLinesToFeatureGroup(response.data.features, this.featureGroupLine);
				} else if (response.data.features !== undefined) {
					this.mapService.addPolyLinesToFeatureGroup([response.data.features], this.featureGroupLine);
				}
			}
		);
	}

}
