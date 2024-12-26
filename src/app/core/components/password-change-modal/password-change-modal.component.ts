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
import { Router } from '@angular/router';
import { SwalAlertService } from '../../services/swal-alert.service';

@Component({
    selector: 'app-password-change-modal',
    imports: [LoadingSpinnerComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
    templateUrl: './password-change-modal.component.html',
    styleUrl: './password-change-modal.component.css'
})
export class PasswordChangeModalComponent {
  @ViewChild('changePasswordModal') changePasswordModal!: TemplateRef<unknown>;
  isLoading$: Observable<boolean>;
  @Input() user: UserInfo = {
    username: '',
    name: '',
    email: '',
    role: '',
    token: ''
  };

  modalRef: NgbModalRef | undefined;
  passwordChangeForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private userService: UserService,
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService,
    private router: Router
  ) {
    this.isLoading$ = loadingService.getLoadingState;
    this.passwordChangeForm = this.formValidationService.createPasswordChangeForm();
  }

  getPasswordErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getFieldErrorMessage(this.passwordChangeForm, fieldName);
  }

  getFormErrorMessage(): string | null {
    const errorType = this.passwordChangeForm.errors ? Object.keys(this.passwordChangeForm.errors)[0] : null;

    const errorMessages: Record<string, string> = {
      passwordsMismatch: 'New password does not match.',
      newPasswordSameAsOld: 'New password cannot be the same as the old password.'
    };

    return errorType ? errorMessages[errorType] : null;
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

  async onSubmit(): Promise<void> {
    if (this.passwordChangeForm.invalid) {
      this.swalAlertService.swalAlertWithTitle('Form Invalid', 'Please check the form fields for errors.', 'error');
      return;
    }

    const isConfirmed = await this.swalAlertService.swalConfirmationAlert(
      'Are you sure you want to change your password?',
      'Yes, change it',
      'warning'
    );

    if (isConfirmed) {
      const userData: PasswordChange = {
        username: this.user.username,
        oldpassword: this.passwordChangeForm.value.oldPassword,
        newPassword: this.passwordChangeForm.value.newPassword
      };

      this.userService.changeUserPassword(userData).pipe(
        finalize(() => {
          this.modalRef?.close();
        })
      ).subscribe({
        next: () => {
          localStorage.removeItem('user');
          this.swalAlertService.swalAlertWithTitle(
            'Password changed successfully!',
            'Please sign in again.',
            'info'
          ).then(() => this.router.navigateByUrl('/auth'));
        }
      });
    }
  }
}