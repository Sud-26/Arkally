import { ServiceFilter, isNullOrWhitespace } from 'projects/nvl-shared/src/public-api';

import { HttpParams } from '@angular/common/http';

export class AlarmListFilter extends ServiceFilter {
    constructor() {
        super();
    }
    name: string;
    vehicles: any;
    userId: string
    traceable_object_type_name: string;
    vehicleType: any;
    toHttpParams(): HttpParams {
        let httpParams = super.toHttpParams();
        if (!(this.traceable_object_type_name === null || this.traceable_object_type_name === undefined)) {
            httpParams = httpParams.append('traceable_object_id', this.traceable_object_type_name);
        }

        if (!(this.vehicleType === null || this.vehicleType === undefined)) {
            httpParams = httpParams.append('vehicleType', this.vehicleType);
        }
        // if (!isNullOrWhitespace(this.name)) {
        //     httpParams = httpParams.append('name', this.name);
        // }
        if (!(this.name === null || this.name === undefined)) {
            httpParams = httpParams.append('name', this.name);
        }
      
      
        return httpParams;
    }

}