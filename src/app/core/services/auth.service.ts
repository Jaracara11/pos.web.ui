import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import { Router } from '@angular/router';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usersUrl = `${environment.apiUrl}/users/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(atob(token.split('.')[1])).exp > Date.now() / 1000 : false;
  }

  signIn(user: UserAuth): void {
    const userData = this.authUser(user);
    localStorage.setItem('user', JSON.stringify(userData));
    this.router.navigateByUrl('');
  }

  signOut(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/auth');
  }

  private authUser(user: UserAuth): Observable<UserInfo> {
    return this.http.post<UserInfo>(this.usersUrl, user);
  }
}