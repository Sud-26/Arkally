import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { environment } from '../../../environments/environment';

const API_URL = environment.api.url;

/**
 * Simple rest client with methods for GET/POST/PUT/DELETE.
 * @author __
 */
@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  constructor(private http: HttpClient, private logger: NGXLogger) { }

  /**
   * Get resource from url.
   * @param path Resources path
   * @param options Optional path params
   */
  get(path: string, options = '') {
    return this.http.get<Response>(`${API_URL}/${path}${options}`).pipe(
      map((res: any) => {
        if (res.success) {
          return res;
        }
        return throwError(res.message);
      }),
      catchError(error => {
        this.logger.error(error);
        return of([]);
      })
    );
  }

  getForDropdown(path: string, options = '') {
    return this.http.get<Response>(`${API_URL}/${path}${options}`).pipe(
      map((res: any) => {
        if (res.success) {
          return res.data;
        }
        return throwError(res.message);
      }),
      catchError(error => {
        this.logger.error(error);
        return of([]);
      })
    );
  }


  /**
   * Put resource.
   * @param path Resource path
   * @param data Put data
   */
  put(path: string, data: any) {
    return this.http.put<Response>(`${API_URL}/${path}`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(error => {
        this.logger.error(error);
        return of([]);
      })
    );
  }

  /**
   * Post resource.
   * @param path Resource path
   * @param data Post data
   */
  post(path: string, data: any) {
    return this.http.post<Response>(`${API_URL}/${path}`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(error => {
        this.logger.error(error);
        return of([]);
      })
    );
  }

  /**
   * Delete resource.
   * @param path Resource path
   * @param id resource id
   */
  delete(path: string, id: any) {
    return this.http.delete<Response>(`${API_URL}/${path}/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(error => {
        this.logger.error(error);
        return of([]);
      })
    );
  }
}
