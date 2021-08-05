import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { HttpParams } from '@angular/common/http';

export class UserManagementFilter extends ServiceFilter {
    constructor() {
        super();
    }

    email: string;
    fullname: string;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();

        if (!isNullOrWhitespace(this.email)) {
            httpParams = httpParams.append('email', this.email);
        }

        if (!isNullOrWhitespace(this.fullname)) {
            httpParams = httpParams.append('fullname', this.fullname);
        }
        return httpParams;
    }

}
