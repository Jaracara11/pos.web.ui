import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Observable } from 'rxjs';
import { FormValidationService } from '../../services/form-validation.service';
import { LoadingService } from '../../services/loading.service';
import { AsyncPipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { UserService } from '../../services/user.service';
import { PasswordChange } from '../../../shared/interfaces/password-change.interface';
import { UserInfo } from '../../../shared/interfaces/user-Info.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SwalAlertService } from '../../services/swal-alert.service';

@Component({
  selector: 'app-password-change-modal',
  standalone: true,
  imports: [LoadingSpinnerComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './password-change-modal.component.html',
  styleUrl: './password-change-modal.component.css'
})
export class PasswordChangeModalComponent {
  @ViewChild('changePasswordModal') changePasswordModal!: TemplateRef<any>;
  @Input() user: UserInfo = {
    username: '',
    name: '',
    email: '',
    role: '',
    token: ''
  };

  modalRef: NgbModalRef | undefined;
  isSubmitting$: Observable<boolean>;
  passwordChangeForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private userService: UserService,
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService,
    private router: Router
  ) {
    this.passwordChangeForm = this.formValidationService.createPasswordChangeForm();
    this.isSubmitting$ = loadingService.getLoadingState;
  }

  getPasswordErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getFieldErrorMessage(this.passwordChangeForm, fieldName);
  }

  getFormErrorMessage(): string | null {
    return this.formValidationService.getFormErrorMessage(this.passwordChangeForm);
  }

  openModal(): void {
    const modalOptions: NgbModalOptions = {
      centered: true,
      size: 'sm',
      windowClass: 'modal-centered'
    };

    this.modalRef = this.modalService.open(this.changePasswordModal, modalOptions);
    this.modalRef.result.then(() => this.passwordChangeForm.reset(), () => this.passwordChangeForm.reset());
  }

  onSubmit(): void {
    if (this.passwordChangeForm.invalid) { return; }

    const userData: PasswordChange = {
      username: this.user.username,
      oldpassword: this.passwordChangeForm.value.oldPassword,
      newPassword: this.passwordChangeForm.value.newPassword
    };

    this.loadingService.setLoadingState = true;

    this.userService.changeUserPassword(userData).pipe(
      finalize(() => {
        this.loadingService.setLoadingState = false;
        this.modalRef?.close();
      })
    ).subscribe({
      next: () => {
        localStorage.removeItem('user');
        this.swalAlertService.swalAlertWithTitle
          ('Password changed successfully!', 'Please sign in again.', 'info').then(
            () => this.router.navigateByUrl('/auth'));
      },
      error: (error: HttpErrorResponse) => {
        this.swalAlertService.swalAlertWithTitle(error.statusText, error?.error?.message, 'error');
      }
    });
  }
}
