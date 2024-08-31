import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/interfaces/product.interface';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { CurrencyPipe } from '@angular/common';
import { SearchInputComponent } from '../../core/components/search-input/search-input.component';
import { UpsertProductModalComponent } from '../../core/components/upsert-product-modal/upsert-product-modal.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, SearchInputComponent, UpsertProductModalComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  @ViewChild(UpsertProductModalComponent) upsertProductModal!: UpsertProductModalComponent;
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  validateRolePermission: boolean;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private swalAlertService: SwalAlertService
  ) {
    this.validateRolePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilteredProductsChange(filteredProducts: Product[]): void {
    this.filteredProducts = filteredProducts;
  }

  getSearchProperty(item: Product): string {
    return `${item.productName} ${item.productDescription} ${item.productCategoryName}`;
  }

  openUpsertProductModal(product?: Product): void {
    if (product) {
      this.selectedProduct = { ...product };
    } else {
      this.selectedProduct = null;
    }
    this.upsertProductModal.openModal();
  }

  private loadProducts(): void {
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Product[]) => {
          this.products = response;
          this.filteredProducts = this.products;
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error?.error?.message || 'An error occurred';
          this.swalAlertService.swalAlertWithTitle(error.statusText, errorMessage, 'error');
        }
      });
  }
}
