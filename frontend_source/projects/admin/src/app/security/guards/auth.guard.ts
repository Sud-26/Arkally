import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../service/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';

/**
 * Authentication Guard.
 * @author __
 */
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        public authenticationService: AuthenticationService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem(environment.storageKey) && this.authenticationService.isAuthenticated()) {
            // TOKEN EXIST AND TOKEN IS VALID
            return true;
        } else {
            // TOKEN EXPIRED OR NON EXISTED
            this.router.navigate(
                [environment.startPage],
                {
                    queryParams: { returnUrl: state.url }
                }
            );
            return false;
        }
    }
}
