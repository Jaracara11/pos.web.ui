import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../shared/interfaces/product.interface';
import { Subject, takeUntil } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { SearchInputComponent } from '../../core/components/search-input/search-input.component';
import { UpsertProductModalComponent } from '../../core/components/upsert-product-modal/upsert-product-modal.component';
import { Category } from '../../shared/interfaces/category.interface';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, SearchInputComponent, UpsertProductModalComponent, AsyncPipe],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit, OnDestroy {
  @ViewChild(UpsertProductModalComponent) upsertProductModal!: UpsertProductModalComponent;
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  validateRolePermission: boolean;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.validateRolePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilteredProductsChange(filteredProducts: Product[]): void {
    this.filteredProducts = filteredProducts;
  }

  getSearchProperty(item: Product): string {
    return `${item.productName} ${item.productDescription} ${item.productCategory.categoryName}`;
  }

  openUpsertProductModal(product?: Product): void {
    this.selectedProduct = product ? { ...product } : null;
    this.upsertProductModal.openModal(this.selectedProduct, this.categories);
  }

  private loadProducts(): void {
    this.productService.productsSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products || [];
        this.filteredProducts = this.products;
      });
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
      });
  }
}