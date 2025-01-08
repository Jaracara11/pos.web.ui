import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
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
      headers = headers.set('Content-Type', 'application/json').set('Authorization', `Bearer ${user.token}`);
    }

    const authReq = req.clone({ headers });

    loadingService.setLoadingState(true);

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          const problemDetails = error.error;
          errorMessage = problemDetails?.detail ||
            (problemDetails?.errors && problemDetails.errors.General?.[0]) ||
            `Error Code: ${error.status} - ${error.statusText}`;
        }

        swalAlertService.swalValidationErrorAlert(error);

        console.error('HTTP Error:', error);

        return throwError(() => new Error(errorMessage));
      }),
      finalize(() => {
        loadingService.setLoadingState(false);
      })
    );
  };