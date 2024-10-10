import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { SwalAlertService } from '../services/swal-alert.service';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';

export const httpRequestInterceptor: HttpInterceptorFn =
  (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const loadingService = inject(LoadingService);
    const swalAlertService = inject(SwalAlertService);
    const userData = localStorage.getItem('user');
    let headers = req.headers;

    if (userData) {
      const user: UserInfo = JSON.parse(userData);
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', `Bearer ${user.token}`);
    }

    const authReq = req.clone({ headers });

    loadingService.setLoadingState(true);

    return next(authReq).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          swalAlertService.swalValidationErrorAlert(error);
        }
      }),
      finalize(() => {
        loadingService.setLoadingState(false);
      })
    );
  };