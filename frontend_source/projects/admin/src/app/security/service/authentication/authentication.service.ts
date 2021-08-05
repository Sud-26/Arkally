import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'projects/admin/src/environments/environment';
import { map } from 'rxjs/operators';

const API_URL = environment.api.url;
const JWT_HELPER = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthenticationService {


  constructor(
    private http: HttpClient
  ) { }

  /**
   * Login.
   * @param username User username
   * @param password User password
   */
  login(username: string, password: string) {
    return this.http.post<any>(`${API_URL}/${environment.api.path.authentication}`, {
      username,
      password
    }).pipe(
      map((res: any) => {
        if (res && res.access_token && res.refresh_token) {

          localStorage.setItem(environment.storageKey,
            JSON.stringify({
              username,
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
            })
          );

          return true;
        } else {
          return false;
        }
      })
    );
  }

  /**
   * Overwrite access token in local storage.
   * @param token access token
   */
  overwriteAccessToken(token: string) {
    const storageData = localStorage.getItem(environment.storageKey);

    localStorage.setItem(environment.storageKey,
      JSON.stringify({
        username: JSON.parse(storageData).username,
        accessToken: token,
        refreshToken: JSON.parse(storageData).refreshToken,
      })
    );
  }

  /**
   * Check if token is expired.
   */
  isAuthenticated(): boolean {
    const storageData = localStorage.getItem(environment.storageKey);
    if (storageData !== null) {
      const token = JSON.parse(storageData).accessToken;

      // TODO refresh token with refresh token
      return !JWT_HELPER.isTokenExpired(token);
    } else {
      return false;
    }
  }

  /**
   * Get superuser info saved in JWT token.
   */
  isSuperuser() {
    return this.getDecodedToken().user.is_superuser;
  }

  /**
   * Get user id saved in JWT token.
   */
  getUserId() {
    return this.getDecodedToken().user.user_id;
  }

  /**
   * Get user fullname from token.
   */
  getUserFullName() {
    return this.getDecodedToken().user.fullname;
  }

  /**
   * Get user attribute value.
   * @param att attribute name
   */
  getUserAttribute(att: string) {
    return this.getDecodedToken().user[att];
  }

  /**
   * Logout from system.
   */
  logout() {
    localStorage.removeItem(environment.storageKey);
  }

  /**
   * Check access.
   * @param tag scope tag
   */
  checkAcl(tag: string) {
    const permission = this.getDecodedToken().user.acl.find(
      x => x === tag
    );

    if (permission === undefined) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Check if action permitted.
   * @param tag scope tag
   * @param action action
   */
  checkPermission(tag: string, action: string) {
    const permission = this.getDecodedToken().scopes.find(
      x => x === `${tag}:${action}`
    );

    if (permission === undefined) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Decode token.
   */
  private getDecodedToken() {
    const storageData = localStorage.getItem(environment.storageKey);
    const accessToken = JSON.parse(storageData).accessToken;
    return (JWT_HELPER.decodeToken(accessToken));
  }

}
