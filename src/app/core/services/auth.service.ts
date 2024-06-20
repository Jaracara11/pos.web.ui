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
}