import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { HttpParams } from '@angular/common/http';

export class RebateFilter extends ServiceFilter {
    constructor() {
        super();
    }

    description: string;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();
        if (!isNullOrWhitespace(this.description)) {
            httpParams = httpParams.append('description', this.description);
        }
        return httpParams;
    }

}
