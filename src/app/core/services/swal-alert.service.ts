import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {

  alertWithSuccess(message: string): void {
    Swal.fire('Thank you...', message, 'success');
  }

  alertWithError(message: string): void {
    Swal.fire('Oops...', message, 'error');
  }
}