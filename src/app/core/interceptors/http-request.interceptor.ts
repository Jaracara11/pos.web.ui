import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { SwalAlertService } from '../services/swal-alert.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoadingState(true);
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log(event);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalValidationErrorAlert(error);
        },
      }),
      finalize(() => {
        this.loadingService.setLoadingState(false);
      })
    );
  }
}