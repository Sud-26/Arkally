import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { HttpParams } from '@angular/common/http';

export class SupportFilter extends ServiceFilter {
    constructor() {
        super();
    }

    email: string;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();
        if (!isNullOrWhitespace(this.email)) {
            httpParams = httpParams.append('email', this.email);
        }
        return httpParams;
    }

}
