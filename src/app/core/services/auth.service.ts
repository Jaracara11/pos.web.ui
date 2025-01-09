import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRepository } from '../repositories/user.repository';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<UserInfo | null>(null);

  constructor(private userRepository: UserRepository) { }

  signIn(user: UserAuth): Observable<UserInfo> {
    return this.userRepository.signIn(user).pipe(
      tap((userInfo) => {
        this.userSubject.next(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
      })
    );
  }

  signOut(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isUserAuth(): boolean {
    const user = this.getAuthInfo();

    if (!user) {
      return false;
    }

    const decodedToken = JSON.parse(atob(user.token.split('.')[1]));

    return decodedToken.exp > Date.now() / 1000;
  }

  getAuthInfo(): UserInfo | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  validateUserRolePermission(roles: string[]): boolean {
    const user = this.getAuthInfo();
    return user ? roles.includes(user.role) : false;
  }
}