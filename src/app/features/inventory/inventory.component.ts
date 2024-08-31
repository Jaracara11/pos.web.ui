import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/interfaces/product.interface';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { CurrencyPipe } from '@angular/common';
import { SearchInputComponent } from '../../core/components/search-input/search-input.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, SearchInputComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  filteredProducts: Product[] = [];
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
