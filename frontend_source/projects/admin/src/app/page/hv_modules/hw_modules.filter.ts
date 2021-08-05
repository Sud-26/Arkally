import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { HttpParams } from '@angular/common/http';

export class ModulesFilter extends ServiceFilter {
    constructor() {
        super();
    }

    name: string;
    user_id: number;

    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();

        if (!isNullOrWhitespace(this.name)) {
            httpParams = httpParams.append('name', this.name);
        }

        if (this.user_id !== undefined && this.user_id !== null) {
            httpParams = httpParams.append('user_id', this.user_id.toString());
        }

        return httpParams;
    }

}
