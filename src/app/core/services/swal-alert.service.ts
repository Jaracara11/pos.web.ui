import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalAlertService {
  SwalObj = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-warning m-3',
      cancelButton: 'btn btn-outline-dark',
    },
    buttonsStyling: false,
  });

  swalMessageAlert(msg: string, alertType: SweetAlertIcon, timer: number = 3000) {
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

  swalConfirmationAlert(title: string, buttonText: string, alertType: SweetAlertIcon): Promise<boolean> {
    return this.SwalObj.fire({
      icon: alertType,
      title: title,
      showCancelButton: true,
      confirmButtonText: `<strong>${buttonText}</strong>`,
      denyButtonText: 'Cancel'
    }).then((result: SweetAlertResult) => {
      return result.isConfirmed || false;
    }).catch(() => {
      return false;
    });
  }
}
