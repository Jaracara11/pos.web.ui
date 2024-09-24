import { Component, TemplateRef, ViewChild } from '@angular/core';
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

  modalRef: NgbModalRef | undefined;
  isSubmitting$: Observable<boolean>;
  productUpsertForm: FormGroup;
  product: Product | null = null;

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

  openModal(selectedProduct: Product | null): void {
    this.product = selectedProduct;
    const modalOptions: NgbModalOptions = {
      centered: true,
      size: 'sm',
      windowClass: 'modal-centered'
    };

    if (selectedProduct) {
      this.productUpsertForm.patchValue({
        productName: selectedProduct.productName,
        productDescription: selectedProduct.productDescription,
      });
    } else {
      this.productUpsertForm.reset();
    }

    this.modalRef = this.modalService.open(this.upsertProductModal, modalOptions);
    this.modalRef.result.then(() => this.productUpsertForm.reset(), () => this.productUpsertForm.reset());
  }

  onSubmit(): void { }
}
