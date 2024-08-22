import { Component } from '@angular/core';
import { BestSellerProduct } from '../../../shared/interfaces/best-seller-product.interface';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalAlertService } from '../../services/swal-alert.service';
import { CacheService } from '../../services/cache.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-best-seller-products',
  standalone: true,
  imports: [],
  templateUrl: './best-seller-products.component.html',
  styleUrl: './best-seller-products.component.css'
})
export class BestSellerProductsComponent {
  private destroy$ = new Subject<void>();
  bestSellerProducts: BestSellerProduct[] = [];

  constructor(
    private productService: ProductService,
    private swalAlertService: SwalAlertService,
    private cacheService: CacheService
  ) { }

  ngOnInit(): void {
    this.loadBestSellerProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBestSellerProducts(): void {
    const cacheKey = 'bestSellerProducts';
    const fallbackObservable: Observable<BestSellerProduct[]> = this.productService.getBestSellerProducts();

    this.cacheService.cacheObservable<BestSellerProduct[]>(cacheKey, fallbackObservable)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: BestSellerProduct[]) => {
          this.bestSellerProducts = response;
        },
        error: (error: HttpErrorResponse) => {
          this.swalAlertService.swalAlertWithTitle(
            error.statusText,
            error.error?.message || 'An error occurred',
            'error'
          );
        }
      });
  }
}
