import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { AuthenticationService } from '../service/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from 'projects/admin/src/environments/environment';

/**
 * Authentication interceptor.
 * @author __
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        public authenticationService: AuthenticationService,
        private route: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            // auto logout if 401 response returned from api and you are already not on login page
            if (err.status === 401) {
                if (!this.route.url.startsWith(`/${environment.startPage}`)) {
                    this.authenticationService.logout();
                    // location.reload(true);
                }
            }

            return throwError(err.error.message || err.statusText);
        }));
    }
}
