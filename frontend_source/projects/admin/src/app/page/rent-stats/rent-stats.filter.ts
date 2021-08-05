// import { DatePipe } from '@angular/common';
import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';
import * as moment from 'moment';

import { HttpParams } from '@angular/common/http';
export class RentStatsFilter extends ServiceFilter {
    constructor() {
        super();
    }
    // toHttpParams(): HttpParams {
    //     let httpParams = super.toHttpParams();
    //     if (!isNullOrWhitespace(this.name)) {
    //         httpParams = httpParams.append('name', this.name);
    //     }
    //     return httpParams;
    // }
    // constructor(private datePipe: DatePipe) {
    //     super();
    // }
  
    traceableObjectId: string;
    slot: string;
    userId: string;
    dateFrom: any;
    dateTo: any;
    name: string;
    quickTime: any;
    // datePipe: DatePipe;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();

        if (!(this.traceableObjectId === null || this.traceableObjectId === undefined)) {
            httpParams = httpParams.append('traceable_object_id', this.traceableObjectId);
        }
        if (!(this.slot === null || this.slot === undefined)) {
            httpParams = httpParams.append('slot', this.slot);
        }
        if (!(this.quickTime === null || this.quickTime === undefined)) {
            httpParams = httpParams.append('quick_time', this.quickTime);
        }

        if (!(this.userId === null || this.userId === undefined)) {
            httpParams = httpParams.append('user_id', this.userId);
        }

        if (this.dateFrom != null || this.dateFrom != undefined) {
            let date = moment(this.dateFrom).format('yyyy-MM-DDTHH:mm')
            // console.log(moment(this.dateFrom).format('yyyy-MM-DDTHH:mm'))
            httpParams = httpParams.append('date_from', date);
            // httpParams = httpParams.append('date_from', moment(this.dateFrom).format('yyyy-MM-DDTHH:mm:ss.SSSZ').toString());
        }

        if (this.dateTo != null || this.dateTo != undefined) {
            let date = moment(this.dateTo).format('yyyy-MM-DDTHH:mm')
            httpParams = httpParams.append('date_to', date);
            // httpParams = httpParams.append('date_to', moment(this.dateTo).format('yyyy-MM-DDTHH:mm:ss.SSSZ'));
        }
        if (!isNullOrWhitespace(this.name)) {
            httpParams = httpParams.append('name', this.name);
        }
        return httpParams;
    }

}