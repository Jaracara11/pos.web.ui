import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PasswordChange } from '../../shared/interfaces/password-change.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _usersUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  changeUserPassword(userData: PasswordChange): Observable<PasswordChange> {
    return this.http.put<PasswordChange>(`${this._usersUrl}/change-password`, userData);
  }
}