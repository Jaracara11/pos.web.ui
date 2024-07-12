import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormValidationService } from '../../services/form-validation.service';
import { LoadingService } from '../../services/loading.service';
import { AsyncPipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-password-change-modal',
  standalone: true,
  imports: [LoadingSpinnerComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './password-change-modal.component.html',
  styleUrl: './password-change-modal.component.css'
})
export class PasswordChangeModalComponent {
  @ViewChild('changePasswordModal') changePasswordModal!: TemplateRef<any>;
  modalRef: NgbModalRef | undefined;
  isSubmitting$: Observable<boolean>;
  passwordChangeForm: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private loadingService: LoadingService
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
    this.loadingService.setLoadingState = true;
    this.loadingService.setLoadingState = false;
    this.modalRef?.close();
  }
}
