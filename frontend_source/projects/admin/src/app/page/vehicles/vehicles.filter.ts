import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { HttpParams } from '@angular/common/http';

export class VehiclesFilter extends ServiceFilter {
    constructor() {
        super();
    }

    name: string;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();
        if (!isNullOrWhitespace(this.name)) {
            httpParams = httpParams.append('name', this.name);
        }
        return httpParams;
    }

}