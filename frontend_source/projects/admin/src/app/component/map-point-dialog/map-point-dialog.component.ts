import { Component, Inject, OnDestroy,Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { environment } from 'projects/admin/src/environments/environment';
import { NotifyService } from '../../service/notify/notify.service';
import { ActiveActionModel } from '../../page/map-dashboard/active-action.model';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'projects/nvl-shared/src/public-api';
import { MapService } from 'projects/nvl-shared/src/lib/service/map/map.service';
// import * as moment from 'moment';
// import 'moment-timezone';

@AutoUnsubscribe()
@Component({
	selector: 'app-map-point-dialog',
	templateUrl: './map-point-dialog.component.html',
	styleUrls: ['./map-point-dialog.component.scss']
})
export class MapPointDialogComponent implements OnDestroy {
	data: any;
	vehicleData: any;
	actions: any[];
	name: string;
	hw_module_id: any;

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


	constructor(
		@Inject(MAT_DIALOG_DATA) public parentData: any,
		public dialogRef: MatDialogRef<MapPointDialogComponent>,
		private restClientService: RestClientService,
		private notifyService: NotifyService,
	) {
		console.log(parentData)
		this.initData(parentData);
		this.poll();
	}

	handleResults(searchObj) {
		this.data = searchObj

		// console.log(this.data, 'dsjfkfsdklfskd;')
	}

	slide($event, action) {
		const model = new ActiveActionModel();

		model.hw_action_id = action.hw_action_id;
		model.name = action.name;
		model.hw_module_id = this.hw_module_id;
		model.value = $event.checked;
		// action.disabled = true;

		this.restClientService.post(environment.api.path.updateCommand + '/' + this.parentList.device_id, model).subscribe(
			response => {
				if (response.success) {
					let responeData = response.data;
					this.disableEngine = responeData.disable_engine_start;
					this.notifyService.successExecute();
					// this.notifyService.successExecute();
				} else {
					this.notifyService.error(response.message);
				}
			}
		);

		// this.restClientService.post(environment.api.path.command, model).subscribe(
		// 	response => {
		// 		if (response.success) {
		// 			this.notifyService.successSave();
		// 		} else {
		// 			this.notifyService.error(response.message);
		// 		}
		// 	}
		// );
	}

	click($event, action) {
		let actionName = action.name.replace(/ /g, "");
		if(action.type === 'button'){
			//sound buzzer //
			if(actionName === "SOUNDBUZZER"){
				this.restClientService
				.get(environment.api.path.soundBuzzerToggle + '/' + this.parentList.device_id)
				.subscribe((response) => {
					if (response.success) {
						let responeData = response.data;
						this.buzzerOn = responeData.buzzer_on;
						this.notifyService.successExecute();	 
					}
				});
	
			} else{
				// stop engine

				const model = new ActiveActionModel();
				model.hw_action_id = action.hw_action_id;
				model.name = action.name;
				model.hw_module_id = this.hw_module_id;
				model.value = !this.stopEngine;
		
				// action.disabled = true;
				this.restClientService.post(environment.api.path.updateCommand + '/' + this.parentList.device_id, model).subscribe(
					response => {
						if(response.success) {
							let responeData = response.data;
							this.stopEngine = responeData.stop_engine;
							this.notifyService.successExecute();
							// this.notifyService.successExecute();
						} else {
							this.notifyService.error(response.message);
						}
					}
				);
			}


		}
			
			// const model = new ActiveActionModel();
				// model.hw_action_id = action.hw_action_id;
				// model.name = action.name;
				// model.hw_module_id = this.hw_module_id;
		
				// action.disabled = true;
		
				// this.restClientService.post(environment.api.path.command, model).subscribe(
				// 	response => {
				// 		if (response.success) {
				// 			this.notifyService.successExecute();
				// 		} else {
				// 			this.notifyService.error(response.message);
				// 		}
				// 	}
				// );
	
	}


	ngOnDestroy(): void {
		this.pollSubscription.unsubscribe();
	}

	private initData(parentData: any) {
	

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
		this.onLoadEvent(this.parentList);

		this.featureInterval();

	

		// console.log(parentData.properties, 'data')
	}

	featureInterval(){
	
		this.features = setInterval(()=> {
			if(localStorage.getItem('featuresData') != null){
				let parseData =   JSON.parse(localStorage.getItem('featuresData'));
				let properties = parseData[0].properties;
				this.onLoadEvent(properties);
				// console.log(properties, 'properties')
			}

		}, 5000)
	}


	private poll() {

		this.pollSubscription = interval(environment.action_poll_interval)
		.pipe(
			startWith(0),
			switchMap(() => this.restClientService.get(`${environment.api.path.module_position.point}/${this.hw_module_id}`))
		)
		.subscribe(res => {
			this.actions = res.data.features[0].vehicle_data.action_list.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));
		});
	
		// this.onLoadEvent(this.parentList);
	}
	// component rendered
	onLoadEvent(row){
		this.alarm_on_tme = row.alarm_on_tme;
		const rentTimeDuration = row.alarm_start;
		this.alarmState = row.alarm_state;

		let d1 = new Date(row.alarm_on_tme),
			d1Seconds =  d1.getSeconds(),       
			pauseDuration = row.alarm_pause_duration;

		d1.setSeconds(d1Seconds + pauseDuration);              

		// debugger
		this.timerData = row.alarm_start;	
		if(row.alarm_state){
			if(!row.alarm_pause_status){                           
				
					this.pausePlayStatus = true;
					
					clearInterval(this.interval);
			
					this.interval =  setInterval(()=> {
						let time = this.timeDiff(new Date(d1));                     
							this.timer = time;
						// call to function after 30 seconds to stop timer
						// console.log((Number(this.nMinutes) * 60) + Number(this.nSeconds), '--', rentTimeDuration * 60);
						// console.log('ss')
						// this.completeRuningTimer(rentTimeDuration);
							
					}, 1000);
				
				
			} else{					
				this.pausePlayStatus = false;
				let time = this.timeDiff(new Date(d1));                     
				this.timer  = time;
				clearInterval(this.interval);
				// this.completeRuningTimer(rentTimeDuration);
			}

		} else{
			this.timerData = '';
			clearInterval(this.interval);
			this.timer = "";
			this.pausePlayStatus = false;
		} 
	}
	// time calculation
	timeDiff(time) {
		let diff =   new Date().getTime() - time.getTime();
		let msec = diff;
		let hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		let mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		let ss = Math.floor(msec / 1000);
		msec -= ss * 1000;


		if (hh < 1 && mm > 0) {
			this.nMinutes = mm;
		}
		this.nMinutes = mm;
		this.nSeconds = ss;
		return mm + ' : ' + ss;
		// }
	 
	}
	// timerInterval(responseData, row){
	// 	let rentTime = Number(responseData.alarm_start) * 60,
	// 		pauseTime = responseData.alarm_pause_duration != null ?  Number(responseData.alarm_pause_duration) : 0,   
	// 		extendedRentTime = rentTime + pauseTime,
	// 		countDownDate = new Date(responseData.alarm_on_tme);

	// 	   let getSeconds = countDownDate.getSeconds();
	// 	   countDownDate.setSeconds(getSeconds + pauseTime);

	// 	clearInterval(this.interval);
	// 	this.interval =  setInterval(()=> {
	// 		let time = this.timeDiff(new Date(countDownDate));                     
	// 			this.timer = time;
	// 		// call to function after 30 seconds to stop timer
	// 		if(((Number(this.nMinutes) * 60) + Number(this.nSeconds))  == extendedRentTime){
	// 			this.timer = '';
	// 			clearInterval(this.interval);
	// 		}
				
	// 	}, 1000);
	// }

	// play pause
	playPause(status) {	
		if(!status){
			clearInterval(this.interval); 
		} else{
			// this.clearTimer(this.features);
			this.featureInterval();
		}
		const model = new AlarmPauseStateModel();
		model.alarm_pause_status = status;
		this.restClientService
			.put(environment.api.path.alarm_pause_status + '/' + this.parentList.device_id, model)
			.subscribe((response) => {
			  if (response.success) {
				let responseData = response.data;
				if(responseData.alarm_pause_status){
					this.pausePlayStatus = false;
				
					clearInterval(this.features); 
				} else{
				
					this.pausePlayStatus = true;
					let d1 = new Date(responseData.alarm_on_tme),
						d1Seconds =  d1.getSeconds();
					d1.setSeconds(d1Seconds + responseData.alarm_pause_duration);
					
					this.interval =  setInterval(()=> {
						let time = this.timeDiff(new Date(d1));                     
						this.timer = time;

						// this.completeRuningTimer(responseData.alarm_start);

					}, 1000);
				


				}

			  } 
		});
	}

	activeAlarm (minute, state){
		
		this.getResponse(minute, state);
	}

	getResponse(minute, state){
		console.log(minute)
		const model = new AlarmStartTimeModel();
		model.alarm_start = Number(minute);
		model.alarm_state = state;

		this.timerData  = minute;
		this.restClientService
			.put(environment.api.path.alarm_list + '/' + this.parentList.device_id, model)
			.subscribe((response) => {
				if (response.success) {
					// this.clearTimer(this.features);
					let responseData = response.data;
						this.alarm_on_tme = responseData.alarm_on_tme; 
						this.alarmState = responseData.alarm_state;
						

						let countDownDate = new Date();
						this.pausePlayStatus = state;
						

						clearInterval(this.interval);
						this.interval = setInterval(()=> {
							// save the time difference into a var for reference
							let time = this.timeDiff(countDownDate);
							// set the spans text to the timer text. 
							this.timer = time;
							// // call to function after 30 seconds to stop timer

							// this.completeRuningTimer(responseData.alarm_start);
						
						}, 1000);	
				} 
		});

}

	clearTimer(state){
		clearInterval(this.interval);
		this.timer= "";
		this.restClientService
		.get(environment.api.path.rentReset + '/' + this.parentList.device_id)
		.subscribe((response) => {
			if(response.success) {
				this.timer = '';
				this.timerData = ""
				clearInterval(this.interval)			
			} 
		});
		// const model = new AlarmStartTimeModel();
		// model.alarm_start = Number(this.parentList.alarm_start);
		// model.alarm_state = state;
		// this.restClientService
		// 	.put(environment.api.path.alarm_list + '/' + this.parentList.device_id, model)
		// 	.subscribe((response) => {
		// 		if (response.success) {
		// 			let responeData = response.data;
		// 				this.alarm_on_tme = responeData.alarm_on_tme; 

		// 				this.pausePlayStatus = state;
		// 				this.timerData  = '';
		// 				clearInterval(this.interval);
							
		// 		} 
		// });
	}
	completeTimer(){
		// this.clearTimer(this.features);

		this.restClientService
		.get(environment.api.path.rentCompleted + '/' + this.parentList.device_id)
		.subscribe((response) => {
			if(response.success) {
				this.timer = '';
				this.timerData = ""
				this.alarmState = response.data.alarm_state;
				clearInterval(this.interval)			
			} 
		});
	}

	completeRuningTimer(alarmStart){

		if(((Number(this.nMinutes) * 60) + Number(this.nSeconds))  >= alarmStart * 60){
			// debugger
			// console.log(alarmStart)
			this.timer = '';
			this.timerData = ""
			clearInterval(this.interval);
			this.completeTimer();
		}
	}

	unsorted(){}





}



export class AlarmStartTimeModel {
	alarm_start: number;
	alarm_state: boolean;

}

export class AlarmPauseStateModel {
    alarm_pause_status: boolean;
}


