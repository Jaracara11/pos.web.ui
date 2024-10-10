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

  async swalConfirmationAlert(title: string, buttonText: string, alertType: SweetAlertIcon): Promise<boolean> {
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
    const errorTitle = error?.error?.title || 'Error';
    const errorMessages: string[] = this.extractSpecificErrorMessages(error, "product");

    const message = errorMessages.length
      ? errorMessages.map(msg => `<small>${msg}</small>`).join('<br>')
      : 'An unknown error occurred.';

    this.swalAlertWithTitle(errorTitle, message, 'error');
  }

  private extractSpecificErrorMessages(error: HttpErrorResponse, field: string): string[] {
    const messages: string[] = [];

    if (error.error?.errors && typeof error.error.errors === 'object') {
      if (error.error.errors[field] && Array.isArray(error.error.errors[field])) {
        messages.push(...error.error.errors[field]);
      } else if (error.error.errors[field]) {
        messages.push(error.error.errors[field]);
      }
    }
    return messages;
  }
}