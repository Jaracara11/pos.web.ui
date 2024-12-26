import { Component, Input, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationService } from '../../services/form-validation.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Category } from '../../../shared/interfaces/category.interface';
import { ProductService } from '../../services/product.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-upsert-product-modal',
    imports: [FormsModule, ReactiveFormsModule, AsyncPipe, CommonModule],
    templateUrl: './upsert-product-modal.component.html',
    styleUrl: './upsert-product-modal.component.css'
})
export class UpsertProductModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isLoading$: Observable<boolean>;
  @ViewChild('upsertProductModal') upsertProductModal!: TemplateRef<unknown>;
  @Input() categories: Category[] = [];
  modalRef: NgbModalRef | undefined;
  productUpsertForm: FormGroup;
  product: Product | null = null;
  defaultCategory: Category = { categoryID: 0, categoryName: 'Select a Category...' };

  constructor(
    private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private swalAlertService: SwalAlertService,
    private productService: ProductService,
    private loadingService: LoadingService
  ) {
    this.productUpsertForm = this.formValidationService.upsertProductForm();
    this.isLoading$ = this.loadingService.getLoadingState;
  }

  ngOnInit(): void {
    this.categories = [this.defaultCategory, ...this.categories];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.modalRef) {
      this.modalRef.close();
    }
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
        productPrice: selectedProduct.productPrice
      });
    } else {
      productIdField?.enable();
      this.productUpsertForm.patchValue({
        productCategory: this.defaultCategory
      });
    }

    this.modalRef = this.modalService.open(this.upsertProductModal, modalOptions);
  }

  async onSubmit(): Promise<void> {
    if (this.productUpsertForm.invalid) {
      return;
    }

    const selectedCategory = this.productUpsertForm.get('productCategory')?.value;

    if (selectedCategory.categoryID === 0) {
      await this.swalAlertService.swalMessageAlert('Please select a valid category.', 'warning');
      return;
    }

    const productData: Product = { ...this.productUpsertForm.value };
    productData.productID = this.productUpsertForm.get('productID')?.value;

    const confirmTitle = this.product ? 'Are you sure you want to update this product?' : 'Are you sure you want to create this new product?';

    const isConfirmed = await this.swalAlertService.swalConfirmationAlert(confirmTitle, 'Confirm', 'warning');

    if (isConfirmed) {
      const request = this.product
        ? this.productService.updateProduct(productData)
        : this.productService.addProduct(productData);

      request.pipe(takeUntil(this.destroy$)).subscribe(() => {
        const successMessage = this.product ? 'Product updated successfully' : 'Product created successfully';
        this.swalAlertService.swalMessageAlert(successMessage, 'success');
        this.productUpsertForm.reset();
        this.modalRef?.close();
      });
    }
  }

  async onDelete(): Promise<void> {
    if (!this.product?.productID) return;

    const confirmTitle = 'Are you sure you want to delete this product?';
    const isConfirmed = await this.swalAlertService.swalConfirmationAlert(confirmTitle, 'Confirm', 'warning');

    if (isConfirmed && this.product?.productID) {
      this.productService.deleteProduct(this.product.productID).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.swalAlertService.swalMessageAlert('Product deleted successfully', 'info');
        this.modalRef?.close();
      });
    }
  }
}