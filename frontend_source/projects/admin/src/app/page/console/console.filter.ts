import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';

export class ConsoleFilter extends ServiceFilter {
    constructor(private datePipe: DatePipe) {
        super();
    }

    message: string;
    dateTo: Date;
    dateFrom: Date;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();

        if (!isNullOrWhitespace(this.message)) {
            httpParams = httpParams.append('message', this.message);
        }

        if (this.dateFrom != null) {
            httpParams = httpParams.append('date_from', this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd'));
        }

        if (this.dateTo != null) {
            httpParams = httpParams.append('date_to', this.datePipe.transform(this.dateTo, 'yyyy-MM-dd'));
        }

        return httpParams;
    }

}