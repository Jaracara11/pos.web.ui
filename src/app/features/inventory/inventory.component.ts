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
  searchQuery: string = '';
  searchQuery$ = new Subject<string>();
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
    this.handleSearchQueryChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  onSearchQueryChange(query: string): void {
    this.searchQuery$.next(query);
  }

  private handleSearchQueryChanges(): void {
    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        this.filterProducts(query);
      });
  }

  private filterProducts(query: string): void {
    if (!query) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.productName.toLowerCase().includes(query.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(query.toLowerCase()) ||
        product.productCategoryName.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
}
