import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import { PasswordChange } from '../../shared/interfaces/password-change.interface';
import { environment } from '../../../environments/environment';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  private _usersUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  signIn(user: UserAuth): Observable<UserInfo> {
    return this.http.post<UserInfo>(`${this._usersUrl}/auth`, user);
  }

  changeUserPassword(userData: PasswordChange): Observable<PasswordChange> {
    return this.http.put<PasswordChange>(`${this._usersUrl}/change-password`, userData);
  }
}
