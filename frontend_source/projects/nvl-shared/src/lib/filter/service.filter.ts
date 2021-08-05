import { HttpParams } from '@angular/common/http';
import { HttpParamsConvertible } from './params-convertible';

export abstract class ServiceFilter implements HttpParamsConvertible {

    protected constructor() {
    }

    toHttpParams(): HttpParams {
        const httpParams = new HttpParams();
        return httpParams;
    }

    isFilterEmpty(): boolean {
        return this.toHttpParams().keys().length < 1;
    }

    toEncodedStringHttpParams() {
        return encodeURIComponent(this.toHttpParams().toString());
    }

}
