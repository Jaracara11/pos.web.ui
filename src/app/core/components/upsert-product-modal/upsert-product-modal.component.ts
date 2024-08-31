import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../../services/form-validation.service';
import { LoadingService } from '../../services/loading.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-upsert-product-modal',
  standalone: true,
  imports: [LoadingSpinnerComponent, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './upsert-product-modal.component.html',
  styleUrl: './upsert-product-modal.component.css'
})
export class UpsertProductModalComponent {
  @ViewChild('upsertProductModal') upsertProductModal!: TemplateRef<any>;
  @Input() product: Product | null = null;

  modalRef: NgbModalRef | undefined;
  isSubmitting$: Observable<boolean>;
  productUpsertForm: FormGroup;

  constructor(private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService) {
    this.productUpsertForm = this.formValidationService.upsertProductForm();
    this.isSubmitting$ = loadingService.getLoadingState;
  }

  getProductErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getFieldErrorMessage(this.productUpsertForm, fieldName);
  }

  getFormErrorMessage(): string | null {
    return this.formValidationService.getFormErrorMessage(this.productUpsertForm);
  }

  openModal(): void {
    const modalOptions: NgbModalOptions = {
      centered: true,
      size: 'sm',
      windowClass: 'modal-centered'
    };

    this.modalRef = this.modalService.open(this.upsertProductModal, modalOptions);
    this.modalRef.result.then(() => this.productUpsertForm.reset(), () => this.productUpsertForm.reset());
  }

  onSubmit(): void { }
}
