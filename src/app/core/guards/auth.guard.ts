import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userString = localStorage.getItem('user');

  if (!userString) {
    router.navigateByUrl('/auth');
    return false;
  }

  const user: UserInfo = JSON.parse(userString);
  const decodedToken = JSON.parse(atob(user.token.split('.')[1]));

  if (decodedToken.exp > Date.now() / 1000) {
    return true;
  }

  return false;
};
