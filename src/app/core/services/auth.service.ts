import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _usersUrl = `${environment.apiUrl}/users/auth`;

  constructor(private http: HttpClient) { }

  signIn(user: UserAuth): Observable<UserInfo> {
    return this.http.post<UserInfo>(this._usersUrl, user);
  }

  signOut(): void {
    localStorage.removeItem('user');
  }

  isUserAuth(): boolean {
    const userData = localStorage.getItem('user');

    if (!userData) { return false; }

    const user: UserInfo = JSON.parse(userData);

    const decodedToken = JSON.parse(atob(user.token.split('.')[1]));

    if (decodedToken.exp > Date.now() / 1000) { return true; }

    return false;
  }

  getAuthInfo(): UserInfo {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  validateUserRolePermission(roles: string[]): boolean {
    const userDataStr = localStorage.getItem('user');

    if (!userDataStr) { return false; }

    const userData: UserInfo = JSON.parse(userDataStr);

    return roles.includes(userData.role);
  }
}
