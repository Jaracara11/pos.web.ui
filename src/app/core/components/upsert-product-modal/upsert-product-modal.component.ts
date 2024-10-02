import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../../services/form-validation.service';
import { LoadingService } from '../../services/loading.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AsyncPipe, NgFor } from '@angular/common';
import { Category } from '../../../shared/interfaces/category.interface';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  categories: Category[] = [];

  constructor(
    private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.productUpsertForm = this.formValidationService.upsertProductForm();
    this.isSubmitting$ = loadingService.getLoadingState;
  }

  getProductErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getFieldErrorMessage(this.productUpsertForm, fieldName);
  }

  openModal(selectedProduct: Product | null, categoriesList: Category[]): void {
    this.product = selectedProduct;
    this.categories = categoriesList;
    const modalOptions: NgbModalOptions = {
      centered: true,
      size: 'md',
      windowClass: 'modal-centered'
    };

    const productIdField = this.productUpsertForm.get('productID');

    if (selectedProduct) {
      productIdField?.disable();
      this.productUpsertForm.patchValue({
        productID: selectedProduct.productID,
        productName: selectedProduct.productName,
        productDescription: selectedProduct.productDescription,
        productCategory: selectedProduct.productCategory,
        productStock: selectedProduct.productStock,
        productCost: selectedProduct.productCost,
        productPrice: selectedProduct.productPrice
      });
    } else {
      this.productUpsertForm.reset();
      productIdField?.enable();
    }

    this.modalRef = this.modalService.open(this.upsertProductModal, modalOptions);
    this.modalRef.result.then(() => this.productUpsertForm.reset(), () => this.productUpsertForm.reset());
  }

  onSubmit(): void {
    if (this.productUpsertForm.invalid) {
      this.swalAlertService.swalAlertWithTitle('Form Invalid', 'Please check the form fields for errors.', 'error');
      return;
    }

    const productData: Product = this.productUpsertForm.value;

    console.log(JSON.stringify(productData, null, 2));

    console.log(productData.productCategory.categoryName);


    const confirmTitle = this.product
      ? 'Are you sure you want to update this product?'
      : 'Are you sure you want to create this new product?';

    this.swalAlertService.swalConfirmationAlert(confirmTitle, 'Confirm', 'warning')
      .then((isConfirmed: boolean) => {
        if (isConfirmed) {
          const request = this.product ? this.productService.updateProduct(productData) : this.productService.addProduct(productData);
          request.subscribe({
            next: () => {
              const successMessage = this.product ? 'Product updated successfully' : 'Product created successfully';
              this.swalAlertService.swalMessageAlert(successMessage, 'success');
              this.modalRef?.close();
            },
            error: (error: HttpErrorResponse) => {
              this.swalAlertService.swalValidationErrorAlert(error);
            }
          });
        }
      });
  }

  onDelete(): void {
    if (!this.product || !this.product.productID) return;

    const confirmTitle = 'Are you sure you want to delete this product?';

    this.swalAlertService.swalConfirmationAlert(confirmTitle, 'Confirm', 'warning')
      .then((isConfirmed: boolean) => {
        if (isConfirmed && this.product && this.product.productID) {
          this.productService.deleteProduct(this.product.productID).subscribe({
            next: () => {
              this.swalAlertService.swalMessageAlert('Product deleted successfully', 'info');
              this.modalRef?.close();
            },
            error: (error: HttpErrorResponse) => {
              this.swalAlertService.swalValidationErrorAlert(error);
            }
          });
        }
      });
  }
}