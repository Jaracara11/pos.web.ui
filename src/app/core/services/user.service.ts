import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { PasswordChange } from '../../shared/interfaces/password-change.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _usersUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  changeUserPassword(userData: PasswordChange): Observable<PasswordChange> {
    const headers = this.authService.userAuthorizationHeaders();
    return this.http.put<PasswordChange>(`${this._usersUrl}/change-password`, userData, { headers });
  }
}