import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SwalAlertService {
  private SwalObj = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-warning m-3',
      cancelButton: 'btn btn-outline-dark',
    },
    buttonsStyling: false,
  });

  swalMessageAlert(msg: string, alertType: SweetAlertIcon, timer = 3000) {
    return this.SwalObj.fire({
      title: msg,
      icon: alertType,
      showConfirmButton: false,
      timer: timer
    });
  }

  swalAlertWithTitle(title: string, message: string, alertType: SweetAlertIcon) {
    return this.SwalObj.fire({
      title: title,
      html: message,
      icon: alertType,
      showConfirmButton: false
    });
  }

  async swalConfirmationAlert(
    title: string,
    buttonText: string,
    alertType: SweetAlertIcon): Promise<boolean> {
    const result: SweetAlertResult = await this.SwalObj.fire({
      icon: alertType,
      title: title,
      showCancelButton: true,
      confirmButtonText: `<strong>${buttonText}</strong>`,
      denyButtonText: 'Cancel',
    });

    return result.isConfirmed || false;
  }

  swalValidationErrorAlert(error: HttpErrorResponse): void {
    const problemDetails = error.error;
    const message =
      problemDetails?.detail ||
      (problemDetails?.errors && problemDetails.errors.General?.[0]) ||
      'An unknown error occurred.';

    this.swalAlertWithTitle(error.statusText, message, 'error');
  }
}