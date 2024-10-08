import { Component, Input, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../../services/form-validation.service';
import { LoadingService } from '../../services/loading.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Category } from '../../../shared/interfaces/category.interface';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upsert-product-modal',
  standalone: true,
  imports: [LoadingSpinnerComponent, FormsModule, ReactiveFormsModule, AsyncPipe, CommonModule],
  templateUrl: './upsert-product-modal.component.html',
  styleUrl: './upsert-product-modal.component.css'
})
export class UpsertProductModalComponent implements OnInit {
  @ViewChild('upsertProductModal') upsertProductModal!: TemplateRef<unknown>;
  @Input() categories: Category[] = [];
  modalRef: NgbModalRef | undefined;
  isSubmitting$: Observable<boolean>;
  productUpsertForm: FormGroup;
  product: Product | null = null;
  defaultCategory: Category = { categoryID: 0, categoryName: 'Select a Category...' }

  constructor(
    private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService,
    private productService: ProductService
  ) {
    this.productUpsertForm = this.formValidationService.upsertProductForm();
    this.isSubmitting$ = loadingService.getLoadingState;
  }

  ngOnInit(): void {
    this.categories = [this.defaultCategory, ...this.categories];
  }

  getProductErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getFieldErrorMessage(this.productUpsertForm, fieldName);
  }

  openModal(selectedProduct: Product | null, categoriesList: Category[]): void {
    this.product = selectedProduct;

    const modalOptions: NgbModalOptions = {
      centered: true,
      size: 'md',
      windowClass: 'modal-centered'
    };

    this.productUpsertForm.reset();
    const productIdField = this.productUpsertForm.get('productID');

    if (selectedProduct) {
      productIdField?.disable();

      const selectedCategory = categoriesList.find(category =>
        category.categoryID === selectedProduct.productCategory.categoryID
      );

      this.productUpsertForm.patchValue({
        productID: selectedProduct.productID,
        productName: selectedProduct.productName,
        productDescription: selectedProduct.productDescription,
        productCategory: selectedCategory,
        productStock: selectedProduct.productStock,
        productCost: selectedProduct.productCost,
        productPrice: selectedProduct.productPrice,
        productQuantity: selectedProduct.productQuantity || 0
      });

      this.categories = [...categoriesList];
    } else {
      productIdField?.enable();
      this.categories = [this.defaultCategory, ...this.categories];
      this.productUpsertForm.patchValue({
        productCategory: this.defaultCategory
      });

    }

    this.modalRef = this.modalService.open(this.upsertProductModal, modalOptions);
  }

  onSubmit(): void {
    if (this.productUpsertForm.invalid) {
      this.swalAlertService.swalAlertWithTitle('Form Invalid', 'Please check the form fields for errors.', 'error');
      return;
    }

    this.loadingService.setLoadingState(true);

    const productData: Product = { ...this.productUpsertForm.value };
    productData.productID = this.productUpsertForm.get('productID')?.value;

    const confirmTitle = this.product ?
      'Are you sure you want to update this product?' :
      'Are you sure you want to create this new product?';

    this.swalAlertService.swalConfirmationAlert(confirmTitle, 'Confirm', 'warning')
      .then((isConfirmed: boolean) => {
        if (isConfirmed) {
          const request = this.product
            ? this.productService.updateProduct(productData)
            : this.productService.addProduct(productData);

          request.pipe(
            finalize(() => {
              this.loadingService.setLoadingState(false);
              this.modalRef?.close();
            })
          ).subscribe({
            next: () => {
              const successMessage = this.product ? 'Product updated successfully' : 'Product created successfully';
              this.swalAlertService.swalMessageAlert(successMessage, 'success');
              this.productUpsertForm.reset();
            },
            error: (error: HttpErrorResponse) => {
              this.swalAlertService.swalValidationErrorAlert(error);
            }
          });
        } else {
          this.loadingService.setLoadingState(false);
        }
      });
  }

  onDelete(): void {
    if (!this.product?.productID) return;

    const confirmTitle = 'Are you sure you want to delete this product?';

    this.swalAlertService.swalConfirmationAlert(confirmTitle, 'Confirm', 'warning')
      .then((isConfirmed: boolean) => {
        if (isConfirmed && this.product?.productID) {
          this.loadingService.setLoadingState(true);
          this.productService.deleteProduct(this.product.productID).pipe(
            finalize(() => {
              this.loadingService.setLoadingState(false);
              this.modalRef?.close();
            })
          ).subscribe({
            next: () => {
              this.swalAlertService.swalMessageAlert('Product deleted successfully', 'info');
            },
            error: (error: HttpErrorResponse) => {
              this.swalAlertService.swalValidationErrorAlert(error);
            }
          });
        }
      });
  }
}