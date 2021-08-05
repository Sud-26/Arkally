import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'projects/admin/src/environments/environment';
import { RestClientService } from '../../service/rest-client/rest-client.service';
import { Observable } from 'rxjs';
import { PageRequest } from 'projects/nvl-shared/src/public-api';
import { Page } from './page.modal';

const path = environment.api.path,
	statsReport = path.vehicle_wise_rent_statics;

@Component({
	selector: 'app-rent-stats-dialog',
	templateUrl: './rent-stats-dialog.component.html',
	styleUrls: ['./rent-stats-dialog.component.scss']
})
export class RentStatsDialogComponent implements OnInit {
	records: any;
	url: any;
	rows: Observable<any[]>;
	page: Page;
	pageRequest: PageRequest = new PageRequest(1, 5);
	columns = [
		{
			name: 'vehicles',
			prop: 'name',
			nonResponsive: true,
			minWidth: 130,
			// maxWidth: 200
		},
		{
			name: 'Time Slot',
			modalView: true,
			prop: 'rentminits',
			// maxWidth: 120
		},
		{
			name: 'Start Time',
			modalView: true,
			prop: 'rent_datetime',
			// maxWidth: 180
		},
		{
			name: 'End Time',
			modalView: true,
			prop: 'end_time',
			// maxWidth: 180
		},
		{
			name: 'Total Duration',
			modalView: true,
			prop: 'total_duration',
			// maxWidth: 120
		},
		{
			name: 'Active Duration',
			modalView: true,
			prop: 'active_duration',
			// maxWidth: 120
		},
		{
			name: 'Pause Duration',
			modalView: true,
			prop: 'alarm_pause_duration',
			// maxWidth: 120
		},
		{
			name: 'Extended Time',
			modalView: true,
			prop: 'extended_time',
			// maxWidth: 120
		}
	];

	constructor(
		@Inject(MAT_DIALOG_DATA)
		public data: RentStatsDialogComponent,
		public restClientService: RestClientService
	) {	
		this.fetchDailog();
	}

	fetchDailog(){
		let quickTime = this.data['quickTime'];
		if (quickTime != undefined && quickTime != '') {
			this.url = statsReport + `?page=${this.pageRequest.page}&size=${this.pageRequest.size}&traceable_object_id=${this.data['userId']}&slot=${this.data['slot']}&quick_time=${this.data['quickTime']}`;
		} else {
			this.url = statsReport + `?page=${this.pageRequest.page}&size=${this.pageRequest.size}&traceable_object_id=${this.data['userId']}&slot=${this.data['slot']}`;
		}
		this.restClientService.get(this.url).subscribe(response => {	
			this.page = response.data;
			let record = response.data.content;
			this.records = record;
			this.rows = record;
		})
	}

	ngOnInit() {
	}

	setPage(pageNumber: number) {
        this.pageRequest.page = pageNumber;
		this.fetchDailog();
    }
	changePageSize(size) {
        this.pageRequest =  new PageRequest(1, size);;
        this.setFirstPage();
    }
	setFirstPage(initFirstPage = true) {
        if (initFirstPage) {
            this.setPage(1);
        }
    }

}
