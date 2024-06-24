import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

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

  swalAlertWithTitle(title: string, message: string, alertType: SweetAlertIcon) {
    return this.SwalObj.fire({
      title: title,
      html: message,
      icon: alertType,
      showConfirmButton: false,
    });
  }
}
