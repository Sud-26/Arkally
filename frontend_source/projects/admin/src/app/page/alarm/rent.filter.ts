import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';

export class RentFilter extends ServiceFilter {

    dateTo: Date;
    dateFrom: Date;
    description: string;
    userId: string;

    constructor(private datePipe: DatePipe) {
        super();
    }

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();

        if (!isNullOrWhitespace(this.description)) {
            httpParams = httpParams.append('description', this.description);
        }

        if (this.dateTo != null) {
            httpParams = httpParams.append('date_to', this.datePipe.transform(this.dateTo, 'yyyy-MM-dd'));
        }

        if (this.dateFrom != null) {
            httpParams = httpParams.append('date_from', this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd'));
        }

        if (!(this.userId === null || this.userId === undefined)) {
            httpParams = httpParams.append('user_id', this.userId);
        }

        return httpParams;
    }

}
