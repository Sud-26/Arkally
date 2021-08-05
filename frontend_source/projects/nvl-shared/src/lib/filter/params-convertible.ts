import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';

export interface HttpParamsConvertible {
    toHttpParams(): HttpParams;
}

export interface RouterParamsConvertible {
    toRouterParams(): Params;
}

export function convertibleToHttpParams(convertibles: HttpParamsConvertible[]): HttpParams {
    let httpParams = new HttpParams();
    if (convertibles != null && convertibles !== void 0 && Array.isArray(convertibles)) {
        for (const convertible of convertibles) {
            if (convertible != null && convertible !== void 0) {
                const requestFilterHttpParams = convertible.toHttpParams();
                for (const key of requestFilterHttpParams.keys()) {
                    for (const value of requestFilterHttpParams.getAll(key)) {
                        httpParams = httpParams.append(key, value);
                    }
                }
            }
        }
    }
    return httpParams;
}
