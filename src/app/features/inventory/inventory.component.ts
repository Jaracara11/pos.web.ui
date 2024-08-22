import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CacheService } from '../../core/services/cache.service';
import { Product } from '../../shared/interfaces/product.interface';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { ProductCacheService } from '../../core/services/product-cache.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  validateRolePermission: boolean;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private productCacheService: ProductCacheService,
    private cacheService: CacheService,
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

  private loadProducts(): void {
    const cacheKey = 'products';
    const fallbackObservable: Observable<Product[]> = this.productService.getAllProducts();

    this.cacheService.cacheObservable<Product[]>(cacheKey, fallbackObservable)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(products => {
          this.productCacheService.setProducts(products);
          return this.productCacheService.getProducts();
        })
      )
      .subscribe({
        next: (products: Product[]) => {
          this.products = products;
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(error.statusText, error.error?.message || 'An error occurred', 'error');
        }
      });
  }
}
