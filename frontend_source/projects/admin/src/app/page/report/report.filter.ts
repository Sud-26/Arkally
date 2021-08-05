import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ServiceFilter } from 'projects/nvl-shared/src/public-api';

export class ReportFilter extends ServiceFilter {
    constructor(private datePipe: DatePipe) {
        super();
    }

    traceableObjectId: string;
    userId: string;
    dateFrom: Date;
    dateTo: Date;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();
        // console.log(this.dateFrom, 'from', this.dateTo)

        if (!(this.traceableObjectId === null || this.traceableObjectId === undefined)) {
            httpParams = httpParams.append('traceable_object_id', this.traceableObjectId);
        }

        if (!(this.userId === null || this.userId === undefined)) {
            httpParams = httpParams.append('user_id', this.userId);
        }

        if (this.dateFrom != null) {
            httpParams = httpParams.append('date_from', this.datePipe.transform(this.dateFrom, 'yyyy-MM-ddTHH:mm:ss.SSSZ'));
        }

        if (this.dateTo != null) {
            httpParams = httpParams.append('date_to', this.datePipe.transform(this.dateTo, 'yyyy-MM-ddTHH:mm:ss.SSSZ'));
        }

        return httpParams;
    }

    toLineHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();

        if (!(this.traceableObjectId === null || this.traceableObjectId === undefined)) {
            httpParams = httpParams.append('vehicles', this.traceableObjectId);
        }

        if (this.dateFrom != null) {
            httpParams = httpParams.append('date_from', this.datePipe.transform(this.dateFrom, 'yyyy-MM-ddTHH:mm:ss.SSSZ'));
        }

        if (this.dateTo != null) {
            httpParams = httpParams.append('date_to', this.datePipe.transform(this.dateTo, 'yyyy-MM-ddTHH:mm:ss.SSSZ'));
        }

        return httpParams;
    }

}
